import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { EntityString, checkEntitySatisfiesDto } from "@nna/nest";
import * as bcryptjs from "bcryptjs";
import { GroupGenreDto, GroupGenreModel } from "~/common/group/genre";

import { GroupGenreRepository } from "./group-genre.repository";
import { GroupEntity } from "../group.entity";

checkEntitySatisfiesDto<GroupGenreEntity, GroupGenreDto>();

/** Entity for the `group genre` features */
@Entity({ repository: () => GroupGenreRepository })
export class GroupGenreEntity
	extends EntityString.Entity({
		// Note: only for example
		_id: { onCreate: () => bcryptjs.hashSync(Date.now().toString()) },
	})
	implements GroupGenreModel
{
	@OneToMany(() => GroupEntity, ({ genre }) => genre)
	public readonly groups = new Collection<GroupEntity>(this);

	@Property({ unique: true })
	public name!: string;
}
