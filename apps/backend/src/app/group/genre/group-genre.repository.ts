import { EntityRepository } from "@mikro-orm/core";

import { GroupGenreEntity } from "./group-genre.entity";

/** The repository to manage {@link GroupGenreEntity group genre}. */
export class GroupGenreRepository extends EntityRepository<GroupGenreEntity> {}
