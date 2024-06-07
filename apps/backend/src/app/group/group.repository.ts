import { EntityRepository } from "@mikro-orm/core";

import { GroupEntity } from "./group.entity";

/** The repository to manage [groups]{@link GroupEntity}. */
export class GroupRepository extends EntityRepository<GroupEntity> {}
