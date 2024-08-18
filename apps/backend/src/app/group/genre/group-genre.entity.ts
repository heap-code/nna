import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { EntityString, checkEntitySatisfiesQueryDto } from "@nna/nest";
import * as bcryptjs from "bcryptjs";
import { GroupGenreModel } from "~/common/group/genre";
import { GroupGenreDto } from "~/common/group/genre/dtos";

import { GroupGenreRepository } from "./group-genre.repository";
import { GroupEntity } from "../group.entity";

checkEntitySatisfiesQueryDto<GroupGenreEntity, GroupGenreDto>();

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
