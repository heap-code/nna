import { Test } from "@nestjs/testing";

import { AuthGuard } from "./auth.guard";
import { AuthModule } from "./auth.module";
import { OrmTestingModule } from "../../../test";
import { ConfigurationModule } from "../../configuration";

describe("AuthGuard", () => {
	let guard: AuthGuard;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({}),
				OrmTestingModule,
			],
			providers: [AuthGuard],
		}).compile();

		guard = module.get(AuthGuard);
	});

	it("should be defined", () => {
		expect(guard).toBeDefined();
	});
});
