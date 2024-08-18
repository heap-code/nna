import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { EntityNumber, checkEntitySatisfiesQueryDto } from "@nna/nest";
import { PersonModel } from "~/common/person";
import { PersonExtendedDto } from "~/common/person/dtos";

import { PersonRepository } from "./person.repository";
import { GroupEntity } from "../group/group.entity";

checkEntitySatisfiesQueryDto<PersonEntity, PersonExtendedDto>();

/** Entity for the `person` features */
@Entity({ repository: () => PersonRepository })
export class PersonEntity extends EntityNumber.Entity() implements PersonModel {
	@ManyToMany(() => GroupEntity, ({ persons }) => persons)
	public readonly groups = new Collection<GroupEntity>(this);

	@Property({ unique: true })
	public name!: string;
}
