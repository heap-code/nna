import { GroupModel } from "../../src/group";
import { PersonModel } from "../../src/person";
import { UserModel } from "../../src/user";

/** Seed data for user */
export interface UserSeedModel extends UserModel {
	/** Plain password to set */
	password: string;
}

/**
 * Content of a seed ~= instance of the application
 * It should have enough data for a DB seed
 */
export interface Seed {
	groups: GroupModel[];
	persons: PersonModel[];
	users: UserSeedModel[];
}
