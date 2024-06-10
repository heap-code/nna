import { Entity } from "@mikro-orm/core";
import { EntityNumber } from "@nna/nest";

import { PersonRepository } from "./person.repository";

@Entity({ repository: () => PersonRepository })
export class PersonEntity extends EntityNumber.Entity() {}
