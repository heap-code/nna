import { Test, TestingModule } from "@nestjs/testing";

import { AuthGuard } from "./auth.guard";
import { AuthModule } from "./auth.module";
import { OrmTesting } from "../../../test";
import { ConfigurationModule } from "../../configuration";

describe("AuthGuard", () => {
	let guard: AuthGuard;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({}),
				OrmTesting.Module,
			],
			providers: [AuthGuard],
		}).compile();

		guard = module.get(AuthGuard);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(guard).toBeDefined();
	});
});
