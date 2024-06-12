import { Entity } from "@mikro-orm/core";
import { EntityString } from "@nna/nest";
import * as bcryptjs from "bcryptjs";

import { GroupGenreRepository } from "./group-genre.repository";

/** Entity for the `group genre` features */
@Entity({ repository: () => GroupGenreRepository })
export class GroupGenreEntity extends EntityString.Entity({
	// Note: only for example
	_id: { onCreate: () => bcryptjs.hashSync(Date.now().toString()) },
}) {}
