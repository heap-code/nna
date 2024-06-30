import { faker } from "@faker-js/faker";

import type { Seeding } from "..";

const date = faker.date.recent();

/** (Almost) empty data */
export const empty = {
	groupGenres: [],
	groups: [],
	persons: [],
	users: [
		{
			_id: 1,
			createdAt: date,
			updatedAt: date,

			_password: "password",
			username: "admin",
		},
	],
} as const satisfies Seeding.Data;
