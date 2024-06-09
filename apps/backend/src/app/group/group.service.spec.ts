import { Test, TestingModule } from "@nestjs/testing";

import { GroupModule } from "./group.module";
import { GroupService } from "./group.service";
import { OrmTestingModule } from "../../../test";

describe("GroupService", () => {
	let service: GroupService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [GroupModule, OrmTestingModule],
		}).compile();

		service = module.get<GroupService>(GroupService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
