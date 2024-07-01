import { NotFoundError } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { OrmTesting } from "../../../test";
import { ConfigurationModule } from "../../configuration";

describe("AuthService", () => {
	let service: AuthService;
	let module: TestingModule;
	let seeder: OrmTesting.DataSeeder;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({}),
				OrmTesting.Module,
			],
			providers: [OrmTesting.DataSeeder],
		}).compile();

		seeder = module.get(OrmTesting.DataSeeder);
		service = module.get<AuthService>(AuthService);
	});

	afterAll(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

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
});
