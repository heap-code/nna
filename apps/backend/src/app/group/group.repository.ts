import { EntityRepository } from "@mikro-orm/core";

import { GroupEntity } from "./group.entity";

/** The repository to manage {@link GroupEntity groups}. */
export class GroupRepository extends EntityRepository<GroupEntity> {}
