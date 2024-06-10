import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { OrmTestingModule } from "../../../test";
import { ConfigurationModule } from "../../configuration";

describe("AuthService", () => {
	let service: AuthService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				AuthModule,
				ConfigurationModule.forRoot({}),
				OrmTestingModule,
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
