import { Entity, Property } from "@mikro-orm/core";
import { EntityNumber, checkEntitySatisfiesDto } from "@nna/nest";
import { PersonDto, PersonModel } from "~/common/person";

import { PersonRepository } from "./person.repository";

checkEntitySatisfiesDto<PersonEntity, PersonDto>();

/** Entity for the `person` features */
@Entity({ repository: () => PersonRepository })
export class PersonEntity extends EntityNumber.Entity() implements PersonModel {
	@Property({ unique: true })
	public name!: string;
}
