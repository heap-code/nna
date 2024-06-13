import { Injectable } from "@nestjs/common";
import { entityServiceBuilder } from "@nna/nest";

import { GroupGenreEntity } from "./group-genre.entity";
import { GroupGenreRepository } from "./group-genre.repository";

/** Service for the `group genre` features */
@Injectable()
export class GroupGenreService extends entityServiceBuilder<GroupGenreEntity>().getClass() {
	public constructor(repository: GroupGenreRepository) {
		super(repository);
	}
}
