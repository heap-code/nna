import { Test } from "@nestjs/testing";

import { AuthGuard } from "./auth.guard";
import { AuthModule } from "./auth.module";

describe("AuthGuard", () => {
	let guard: AuthGuard;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [AuthModule],
			providers: [AuthGuard],
		}).compile();

		guard = module.get(AuthGuard);
	});

	it("should be defined", () => {
		expect(guard).toBeDefined();
	});
});
