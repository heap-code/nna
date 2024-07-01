import { Test, TestingModule } from "@nestjs/testing";

import { GroupController } from "./group.controller";
import { GroupModule } from "./group.module";
import { OrmTesting } from "../../../test";

describe("GroupController", () => {
	let controller: GroupController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [GroupModule, OrmTesting.Module],
		}).compile();

		controller = module.get<GroupController>(GroupController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
