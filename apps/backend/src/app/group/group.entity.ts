import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class GroupEntity {
	@PrimaryKey()
	public _id!: number;

	@Property({ unique: true })
	public name!: string;
}
