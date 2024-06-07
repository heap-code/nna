import { EntityRepository } from "@mikro-orm/core";

import { PersonEntity } from "./person.entity";

/** The repository to manage [persons]{@link PersonEntity}. */
export class PersonRepository extends EntityRepository<PersonEntity> {}
