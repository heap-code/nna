import { Entity, Property } from "@mikro-orm/core";
import { EntityNumber } from "@nna/nest";

@Entity()
export class GroupEntity extends EntityNumber.Entity() {
	@Property({ unique: true })
	public name!: string;
}
