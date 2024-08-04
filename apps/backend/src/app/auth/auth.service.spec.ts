import { NotFoundError } from "@mikro-orm/core";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { JWT } from "./jwt";
import { OrmTesting } from "../../../test";
import { ConfigurationModule } from "../../configuration";

describe("AuthService", () => {
	let service: AuthService;
	let jwtService: JwtService;
	let module: TestingModule;
	let seeder: OrmTesting.DataSeeder;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({}),
				OrmTesting.Module,
			],
		}).compile();

		seeder = module.get(OrmTesting.DataSeeder);
		service = module.get(AuthService);
		jwtService = module.get(JwtService);
	});

	afterAll(() => module.close());

	describe("Find user by credentials", () => {
		const refresh = () =>
			seeder.generate({ seed: "empty" }).then(({ users }) => users[0]);

		let user: Awaited<ReturnType<typeof refresh>>;
		beforeEach(async () => {
			user = await refresh();
		});

		it("should get a user by its credentials", async () => {
			const found = await service.getUserByCredentials(
				user.username,
				user._password,
			);
			expect(found._id).toBe(user._id);
			expect(found.username).toBe(user.username);
			expect(found.createdAt).toStrictEqual(user.createdAt);
		});

		it("should fail with wrong username", async () => {
			await expect(() =>
				service.getUserByCredentials(
					user.username + user.username,
					user._password,
				),
			).rejects.toThrow(NotFoundError);
		});

		it("should fail with wrong password", async () => {
			await expect(() =>
				service.getUserByCredentials(
					user.username,
					user._password + user._password,
				),
			).rejects.toThrow(NotFoundError);
		});
	});

	describe("Auth JWT", () => {
		const refresh = () =>
			seeder.generate({ seed: "empty" }).then(({ users }) => users[0]);

		let user: Awaited<ReturnType<typeof refresh>>;
		beforeEach(async () => {
			user = await refresh();
		});

		it("should throw an error when creating a JWT Payload with invalid credentials", async () => {
			await expect(() =>
				service.createJwtPayloadFromCredentials(
					user.username,
					`${user._password}1`,
				),
			).rejects.toThrow(UnauthorizedException);
		});

		it("should throw an error when validating an invalid payload", async () => {
			const [payloadRaw] = await service.createJwtPayloadFromCredentials(
				user.username,
				`${user._password}`,
			);

			const { token } = await service.signJwtPayload(payloadRaw);
			const payload = jwtService.decode<JWT.PayloadFull>(token);

			await expect(() =>
				service.validateJwtPayload({
					...payload,
					userId: -1,
				} satisfies typeof payload),
			).rejects.toThrow(UnauthorizedException);

			const payloadFull = await service.validateJwtPayload(payload);
			expect(payloadFull.exp).toBeGreaterThan(0);
			expect(payloadFull.iat).toBeGreaterThan(0);
			expect(payloadFull.userId).toBe(user._id);
		});
	});
});
