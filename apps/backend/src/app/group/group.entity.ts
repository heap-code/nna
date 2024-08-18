import {
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	Opt,
	Property,
} from "@mikro-orm/core";
import { EntityNumber, checkEntitySatisfiesQueryDto } from "@nna/nest";
import { GroupModel } from "~/common/group";
import { GroupExtendedDto } from "~/common/group/dtos";

import { GroupGenreEntity } from "./genre/group-genre.entity";
import { GroupRepository } from "./group.repository";
import { PersonEntity } from "../person/person.entity";

checkEntitySatisfiesQueryDto<GroupEntity, GroupExtendedDto>();

/** Entity for the `group` features */
@Entity({ repository: () => GroupRepository })
export class GroupEntity extends EntityNumber.Entity() implements GroupModel {
	@ManyToMany({
		entity: () => PersonEntity,
		owner: true,
		updateRule: "cascade",
	})
	public readonly persons = new Collection<PersonEntity>(this);

	@ManyToOne(() => GroupGenreEntity, { eager: true })
	public genre!: GroupGenreEntity;

	@Property({ unique: true })
	public name!: string;

	@Property({ getter: true, persist: false })
	public get genreId(): Opt<string> {
		return this.genre._id;
	}
}
