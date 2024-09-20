import { AnyEntity, EntityClass, EntityManager } from "@mikro-orm/core";
import * as OrmPostgres from "@mikro-orm/postgresql";
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
			em.create(PersonEntity, {
				...person,
				groups: _groupIds.map(id => em.getReference(GroupEntity, id)),
			});
		}

		if (em.getDriver() instanceof OrmPostgres.PostgreSqlDriver) {
			await em.flush();
			await (em as OrmPostgres.EntityManager).transactional(em =>
				this.updatePostgresPKSequences(em),
			);
		}
	}

	/**
	 * Update the primary key sequences for PostgresSQL
	 *
	 * @param em to make the updates
	 */
	private async updatePostgresPKSequences(em: OrmPostgres.EntityManager) {
		for (const entity of em.config.getAll().entities) {
			const { primaryKeys, properties, tableName } = em.getMetadata(
				entity as EntityClass<AnyEntity>,
			);

			if (primaryKeys.length !== 1) {
				continue;
			}

			const [primaryKey] = primaryKeys;
			const primaryProperty = properties[primaryKey];
			if (!primaryProperty.primary || !primaryProperty.autoincrement) {
				continue;
			}

			await em.execute(
				`SELECT SETVAL('${tableName}_${primaryKey}_seq', (SELECT MAX("${primaryKey}") FROM "${tableName}"))`,
			);
		}
	}
}
