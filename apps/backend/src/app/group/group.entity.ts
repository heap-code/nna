import { Entity, ManyToOne, Opt, Property } from "@mikro-orm/core";
import { EntityNumber, checkEntitySatisfiesDto } from "@nna/nest";
import { GroupDto, GroupModel } from "~/common/group";

import { GroupGenreEntity } from "./genre/group-genre.entity";
import { GroupRepository } from "./group.repository";

checkEntitySatisfiesDto<GroupEntity, GroupDto>();

/** Entity for the `group` features */
@Entity({ repository: () => GroupRepository })
export class GroupEntity extends EntityNumber.Entity() implements GroupModel {
	@ManyToOne(() => GroupGenreEntity, { eager: true })
	public genre!: GroupGenreEntity;

	@Property({ unique: true })
	public name!: string;

	@Property({ getter: true, persist: false })
	public get genreId(): Opt<string> {
		return this.genre._id;
	}
}
