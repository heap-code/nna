import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Schemas } from "@nna/core";
import * as dateFns from "date-fns";
import supertest from "supertest";
import {
	AUTH_HTTP_CONFIG,
	AuthLogin,
	AuthProfile,
	AuthSuccess,
} from "~/common/auth";

import { AuthModule } from "./auth.module";
import { OrmTesting } from "../../../test";
import { bootstrap } from "../../bootstrap";
import { ConfigurationModule } from "../../configuration";
import { Environment } from "../../configuration/environments";

describe("AuthController", () => {
	let app: INestApplication;
	let request: supertest.Agent;
	let seeder: OrmTesting.DataSeeder;

	const AUTH_CONFIG = {
		cookie: { name: "abc", secure: false },
		duration: 3,
		secret: "s",
	} as const satisfies Partial<Environment["auth"]>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({
					auth: AUTH_CONFIG,
					host: { globalPrefix: "" },
				}),
				OrmTesting.Module,
			],
		}).compile();

		seeder = module.get(OrmTesting.DataSeeder);

		[app] = bootstrap(module.createNestApplication());
		await app.init();
		request = supertest(app.getHttpServer() as never);
	});

	afterEach(() => app.close());

	it("should fail to get profile when un-logged", async () => {
		const { statusCode } = await request.get(
			AUTH_HTTP_CONFIG.routes.getProfile.path({}),
		);
		expect(statusCode).toBe(401);
	});

	describe("Login and auth token", () => {
		afterEach(() => {
			jest.useRealTimers();
		});

		async function testLogin() {
			const [user] = await seeder
				.generate({ seed: "simple" })
				.then(({ users }) => users);

			const now = new Date(2000, 1, 1);
			jest.useFakeTimers({ doNotFake: ["nextTick", "setTimeout"], now });

			const res = await request
				.post(AUTH_HTTP_CONFIG.routes.login.path({}))
				.send({
					cookie: true,
					password: user._password,
					username: user.username,
				} satisfies AuthLogin.Dto);
			expect(res.statusCode).toBe(201);

			const body = Schemas.objectForJson(AuthSuccess.schema).parse(
				res.body,
			);
			const { expireOn, issuedAt, token } = body;
			expect(token).toBeTruthy();
			expect(issuedAt).toStrictEqual(now);
			expect(expireOn).toStrictEqual(
				dateFns.addSeconds(now, AUTH_CONFIG.duration),
			);

			return { body, headers: res.headers, user };
		}

		it("should log and return the profile (via header auth)", async () => {
			const {
				body: { expireOn, issuedAt, token },
				user,
			} = await testLogin();

			const res = await request
				.get(AUTH_HTTP_CONFIG.routes.getProfile.path({}))
				.set({ authorization: `Bearer ${token}` });
			expect(res.statusCode).toBe(200);

			const body = Schemas.objectForJson(AuthProfile.schema).parse(
				res.body,
			);
			expect(body.user._id).toStrictEqual(user._id);
			expect(body.issuedAt).toStrictEqual(issuedAt);
			expect(body.expireOn).toStrictEqual(expireOn);
		});

		it("should log and return the profile (with cookie)", async () => {
			const {
				headers: { "set-cookie": cookie },
			} = await testLogin();

			const res = await request
				.get(AUTH_HTTP_CONFIG.routes.getProfile.path({}))
				.set("Cookie", [cookie]);
			expect(res.statusCode).toBe(200);
		});

		it("should refresh the token", async () => {
			const { body } = await testLogin();

			await new Promise(res => setTimeout(res, 2500));
			const res = await request
				.post(AUTH_HTTP_CONFIG.routes.refresh.path({}))
				.set({ authorization: `Bearer ${body.token}` });
			expect(res.statusCode).toBe(201);

			const { expireOn, issuedAt, token } = Schemas.objectForJson(
				AuthSuccess.schema,
			).parse(res.body);

			expect(issuedAt.getTime()).toBeGreaterThan(body.issuedAt.getTime());
			expect(expireOn.getTime()).toBeGreaterThan(body.expireOn.getTime());
			expect(token).not.toBe(body.token);
		});

		it("should return 401 when token expire", async () => {
			const {
				body: { expireOn, token },
			} = await testLogin();

			const { statusCode: code0 } = await request
				.get(AUTH_HTTP_CONFIG.routes.getProfile.path({}))
				.set({ authorization: `Bearer ${token}` });
			expect(code0).toBe(200);
			jest.useRealTimers();

			// Sleep until expired
			await new Promise(res =>
				setTimeout(res, AUTH_CONFIG.duration * 1000),
			);
			expect(expireOn.getTime()).toBeLessThan(Date.now());

			const { statusCode: code1 } = await request
				.get(AUTH_HTTP_CONFIG.routes.getProfile.path({}))
				.set({ authorization: `Bearer ${token}` });
			expect(code1).toBe(401);
		});
	});
});
