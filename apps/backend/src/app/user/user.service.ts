import { Injectable } from "@nestjs/common";
import { entityServiceBuilder } from "@nna/nest";

import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

/** Service for the `user` features */
@Injectable()
export class UserService extends entityServiceBuilder<UserEntity>().getClass() {
	public constructor(repository: UserRepository) {
		super(repository);
	}

	/**
	 * Find a user by its username
	 *
	 * @param username to search
	 * @returns the found user
	 */
	public async findByUsername(username: string) {
		return this.findOne({ username });
	}
}
