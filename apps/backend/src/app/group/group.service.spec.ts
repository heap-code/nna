import { Test, TestingModule } from "@nestjs/testing";

import { GroupModule } from "./group.module";
import { GroupService } from "./group.service";
import { OrmTesting } from "../../../test";

describe("GroupService", () => {
	let service: GroupService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GroupModule, OrmTesting.Module],
		}).compile();

		service = module.get<GroupService>(GroupService);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
