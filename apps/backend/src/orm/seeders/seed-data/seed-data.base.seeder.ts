import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { SeedData } from "~/testing/seeds";

import { AuthService } from "../../../app/auth/auth.service";
import { GroupGenreEntity } from "../../../app/group/genre/group-genre.entity";
import { GroupEntity } from "../../../app/group/group.entity";
import { PersonEntity } from "../../../app/person/person.entity";
import { UserEntity } from "../../../app/user/user.entity";

/** Seed the database with a {@link SeedData} */
export abstract class SeedDataBaseSeeder<
	T extends SeedData = SeedData,
> extends Seeder {
	/**
	 * Gets the data to seed
	 *
	 * @returns the data to seed
	 */
	public abstract getSeed(): T;

	/** @inheritDoc */
	public override async run(em: EntityManager) {
		const { users, ...seed }: SeedData = this.getSeed();

		// Create all users
		await Promise.all(
			users.map(({ _password, ...user }) =>
				AuthService.hash(_password).then(password =>
					em.create(UserEntity, { ...user, password }),
				),
			),
		);

		for (const groupGenre of seed.groupGenres) {
			em.create(GroupGenreEntity, groupGenre);
		}
		for (const { genreId, ...group } of seed.groups) {
			em.create(GroupEntity, {
				...group,
				genre: em.getReference(GroupGenreEntity, genreId),
			});
		}
		for (const { _groupIds, ...person } of seed.persons) {
			em.create(PersonEntity, { ...person });
		}
	}
}
