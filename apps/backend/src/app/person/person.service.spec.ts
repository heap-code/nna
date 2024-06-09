import { Test, TestingModule } from "@nestjs/testing";

import { PersonModule } from "./person.module";
import { PersonService } from "./person.service";
import { OrmTestingModule } from "../../../test";

describe("PersonService", () => {
	let service: PersonService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmTestingModule, PersonModule],
		}).compile();

		service = module.get<PersonService>(PersonService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
