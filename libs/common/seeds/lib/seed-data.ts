import { GroupModel } from "../../src/group";
import { GroupGenreModel } from "../../src/group/genre";
import { PersonModel } from "../../src/person";
import { UserModel } from "../../src/user";

/** Seed data for {@link PersonModel} */
export interface PersonSeedModel extends PersonModel {
	/** Group ids that a person likes/is listening to */
	_groupIds: number[];
}

/** Seed data for {@link UserModel} */
export interface UserSeedModel extends UserModel {
	/** Plain password to set */
	_password: string;
}

/**
 * Content of a seed ~= instance of the application
 * It should have enough data for a DB seed.
 *
 * Prefer `as const satisfies SeedData` when defining the seed.
 *
 * Use `faker` (https://fakerjs.dev/) for random data, BUT
 * 	also set values manually, especially for edge cases (avoid "blind-tests")
 * 	and it gives more deterministic results when testing.
 */
export interface SeedData {
	groupGenres: GroupGenreModel[];
	groups: GroupModel[];
	persons: PersonSeedModel[];
	users: UserSeedModel[];
}
