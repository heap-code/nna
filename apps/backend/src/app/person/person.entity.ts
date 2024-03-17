import { Entity } from "@mikro-orm/core";
import { EntityNumber } from "@nna/nest";

@Entity()
export class PersonEntity extends EntityNumber.Entity() {}
