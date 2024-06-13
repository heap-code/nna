import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { EntityNumber, checkEntitySatisfiesDto } from "@nna/nest";
import { PersonDtoExtended, PersonModel } from "~/common/person";

import { PersonRepository } from "./person.repository";
import { GroupEntity } from "../group/group.entity";

checkEntitySatisfiesDto<PersonEntity, PersonDtoExtended>();

/** Entity for the `person` features */
@Entity({ repository: () => PersonRepository })
export class PersonEntity extends EntityNumber.Entity() implements PersonModel {
	@ManyToMany(() => GroupEntity, ({ persons }) => persons)
	public readonly groups = new Collection<GroupEntity>(this);

	@Property({ unique: true })
	public name!: string;
}
