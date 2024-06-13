import { Test, TestingModule } from "@nestjs/testing";

import { GroupGenreModule } from "./group-genre.module";
import { GroupGenreService } from "./group-genre.service";
import { OrmTestingModule } from "../../../../test";

describe("GroupGenreService", () => {
	let service: GroupGenreService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GroupGenreModule, OrmTestingModule],
		}).compile();

		service = module.get<GroupGenreService>(GroupGenreService);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
