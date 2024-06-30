import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { AuthModule } from "./auth.module";
import { OrmTesting } from "../../../test";
import { ConfigurationModule } from "../../configuration";

describe("AuthController", () => {
	let controller: AuthController;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({}),
				OrmTesting.Module,
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
