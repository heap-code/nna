import { Test, TestingModule } from "@nestjs/testing";

import { GroupGenreController } from "./group-genre.controller";
import { GroupGenreModule } from "./group-genre.module";
import { OrmTesting } from "../../../../test";

describe("GroupGenreController", () => {
	let controller: GroupGenreController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [GroupGenreModule, OrmTesting.Module],
		}).compile();

		controller = module.get<GroupGenreController>(GroupGenreController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
