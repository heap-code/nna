import { Test, TestingModule } from "@nestjs/testing";

import { UserModule } from "./user.module";
import { UserService } from "./user.service";
import { OrmTestingModule } from "../../../test";

describe("UserService", () => {
	let service: UserService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [OrmTestingModule, UserModule],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
