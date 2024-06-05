import { EntityRepository } from "@mikro-orm/core";

import { UserEntity } from "./user.entity";

/** The repository to manage [users]{@link UserEntity}. */
export class UserRepository extends EntityRepository<UserEntity> {}
