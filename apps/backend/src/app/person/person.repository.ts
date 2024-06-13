import { EntityRepository } from "@mikro-orm/core";

import { PersonEntity } from "./person.entity";

/** The repository to manage {@link PersonEntity persons}. */
export class PersonRepository extends EntityRepository<PersonEntity> {}
