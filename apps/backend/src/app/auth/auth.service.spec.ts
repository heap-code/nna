import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { ConfigurationModule } from "../../configuration";

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AuthModule, ConfigurationModule.forRoot({})],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
