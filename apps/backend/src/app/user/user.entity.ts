import { Entity, Property } from "@mikro-orm/core";
import { EntityBase } from "@nna/nest";
import { UserModel } from "~/common/user";

@Entity()
export class UserEntity extends EntityBase implements UserModel {
	@Property({ unique: true })
	public email!: string;
}
