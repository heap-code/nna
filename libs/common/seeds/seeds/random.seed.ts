import { faker } from "@faker-js/faker";
import { ModelAny } from "@nna/core";
import * as z from "zod";

import type { Seeding } from "..";

/** Default password for {@link random} seed */
export const RANDOM_DEFAULT_PASSWORD = "password";

const nItemSchema = z.number().min(0).optional();

/** Validation schema for {@link RandomOptions} */
export const randomOptionsSchema = z.object({
	nGroupGenres: nItemSchema,
	nGroups: nItemSchema,
	nPersons: nItemSchema,
	nUsers: nItemSchema,
	password: z.string().default(RANDOM_DEFAULT_PASSWORD).optional(),
});

/** Options for {@link random} seed generator */
export type RandomOptions = z.infer<typeof randomOptionsSchema>;

/**
 * Generate a bunch of data
 *
 * @param options to generate the seed
 * @returns random {@link Seeding.Data}
 */
export function random(options: RandomOptions = {}): Seeding.Data {
	const {
		nGroupGenres = 20,
		nGroups = 400,
		nPersons = 1600,
		nUsers = 50,
		password = RANDOM_DEFAULT_PASSWORD,
	} = options;

	const getDates = (): Pick<ModelAny, "createdAt" | "updatedAt"> => {
		const updatedAt = faker.date.recent();
		const createdAt = faker.date.recent({ days: 3, refDate: updatedAt });
		return { createdAt, updatedAt };
	};

	// Generate random group genres
	const groupGenres = faker.helpers
		.uniqueArray(() => faker.music.genre(), nGroupGenres)
		.map<
			Seeding.Data["groupGenres"][number]
		>((name, i) => ({ ...getDates(), _id: `id-${i}`, name }));
	const groupGenreIds = groupGenres.map(({ _id }) => _id);

	// Generate random groups
	const groups = faker.helpers
		.uniqueArray(() => faker.commerce.productName(), nGroups)
		.map<
			Seeding.Data["groups"][number]
		>((name, i) => ({ ...getDates(), _id: i + 1, genreId: faker.helpers.arrayElement(groupGenreIds), name }));
	const groupIds = groups.map(({ _id }) => _id);

	// Generate random persons
	const persons = faker.helpers
		.uniqueArray(() => faker.person.fullName(), nPersons)
		.map<
			Seeding.Data["persons"][number]
		>((name, i) => ({ ...getDates(), _groupIds: faker.helpers.arrayElements(groupIds, { max: 10, min: 0 }), _id: i + 1, name }));

	// Generate random users
	const users = faker.helpers
		.uniqueArray(() => faker.internet.userName(), nUsers)
		.map<
			Seeding.Data["users"][number]
		>((username, i) => ({ ...getDates(), _id: i + 1, _password: password, username }));

	return { groupGenres, groups, persons, users };
}
