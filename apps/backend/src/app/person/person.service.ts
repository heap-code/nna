import { Injectable } from "@nestjs/common";
import { entityServiceBuilder } from "@nna/nest";

import { PersonEntity } from "./person.entity";
import { PersonRepository } from "./person.repository";

@Injectable()
export class PersonService extends entityServiceBuilder<PersonEntity>().getClass() {
	public constructor(repository: PersonRepository) {
		super(repository);
	}
}
