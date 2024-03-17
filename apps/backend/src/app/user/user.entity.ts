import { Entity, Property } from "@mikro-orm/core";
import { EntityNumber } from "@nna/nest";
import { UserModel } from "~/common/user";

@Entity()
export class UserEntity extends EntityNumber.Entity() implements UserModel {
	@Property({ unique: true })
	public email!: string;
}
