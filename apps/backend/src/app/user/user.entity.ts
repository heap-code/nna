import {
	Entity,
	EntityRepositoryType,
	Property,
	ScalarReference,
	StringType,
} from "@mikro-orm/core";
import { EntityNumber } from "@nna/nest";
import { UserModel } from "~/common/user";

import { UserRepository } from "./user.repository";

/** Entity for the `user` features */
@Entity({ repository: () => UserRepository })
export class UserEntity extends EntityNumber.Entity() implements UserModel {
	/** @see https://mikro-orm.io/docs/repositories#inferring-custom-repository-type */
	public [EntityRepositoryType]?: UserRepository;

	@Property({ unique: true })
	public username!: string;

	/** Password (hashed) of the user. It needs to load the ref to get it */
	@Property({
		hidden: true,
		lazy: true,
		nullable: false,
		ref: true,
		type: StringType,
	})
	public password!: ScalarReference<string>;
}
