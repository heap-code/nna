import { Entity } from "@mikro-orm/core";
import { EntityBase } from "@nna/nest";

@Entity()
export class PersonEntity extends EntityBase {}
