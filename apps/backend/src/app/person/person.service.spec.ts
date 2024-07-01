import { Test, TestingModule } from "@nestjs/testing";

import { PersonModule } from "./person.module";
import { PersonService } from "./person.service";
import { OrmTesting } from "../../../test";

describe("PersonService", () => {
	let service: PersonService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [OrmTesting.Module, PersonModule],
		}).compile();

		service = module.get<PersonService>(PersonService);
	});

	afterEach(() => module.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
