import { Entity, Property } from "@mikro-orm/core";
import { EntityBase } from "@nna/nest";

@Entity()
export class GroupEntity extends EntityBase {
	@Property({ unique: true })
	public name!: string;
}
