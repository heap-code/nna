import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { UserModel } from "~/common/user";

@Entity()
export class UserEntity implements Pick<UserModel, "_id"> {
	@PrimaryKey()
	public _id!: number;

	@Property({ unique: true })
	public email!: string;
}
