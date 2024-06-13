import { faker } from "@faker-js/faker";

import { Seed } from "../lib";

const date2 = faker.date.recent();
const date1 = faker.date.recent({ days: 5, refDate: date2 });

/** Simple/basic set of data */
export const simple = {
	groupGenres: [
		{
			_id: "gg1",
			createdAt: date1,
			updatedAt: date1,

			name: `group-genre1`,
		},
		{
			_id: "gg2",
			createdAt: date1,
			updatedAt: date2,

			name: `group-genre2`,
		},
		{
			_id: "gg10",
			createdAt: date2,
			updatedAt: date2,

			name: faker.music.genre(),
		},
	],
	groups: [
		{
			_id: 1,
			createdAt: date1,
			updatedAt: date1,

			genreId: "gg1",
			name: "group1",
		},
		{
			_id: 2,
			createdAt: date1,
			updatedAt: date2,

			genreId: "gg2",
			name: "group2",
		},
		{
			_id: 5,
			createdAt: date2,
			updatedAt: date2,

			genreId: "gg2",
			name: "group5",
		},
	],
	persons: [
		{
			_id: 1,
			createdAt: date1,
			updatedAt: date1,

			_groupIds: [1, 2, 5],
			name: "person1/listener",
			// peopleType: { type: "listener" },
		},
		{
			_id: 2,
			createdAt: date1,
			updatedAt: date1,

			_groupIds: [5],
			name: "person2/listener",
			// peopleType: { type: "listener" },
		},
		{
			_id: 5,
			createdAt: date1,
			updatedAt: date1,

			_groupIds: [1],
			name: "person5/musician",
			// peopleType: { groupId: 1, instrument: "Guitar", type: "musician" },
		},
		{
			_id: 6,
			createdAt: date1,
			updatedAt: date2,

			_groupIds: [1, 2],
			name: "person6/musician",
			// peopleType: { groupId: 2, instrument: "Piano", type: "musician" },
		},
		{
			_id: 7,
			createdAt: date2,
			updatedAt: date2,

			_groupIds: [1, 5],
			name: "person7/musician",
			// peopleType: { groupId: 1, instrument: "Drums", type: "musician" },
		},
		{
			_id: 8,
			createdAt: date2,
			updatedAt: date2,

			_groupIds: [],
			name: "person8/musician",
			// peopleType: { groupId: null, instrument: "Harp", type: "musician" },
		},
	],
	users: [
		{
			_id: 1,
			createdAt: date1,
			updatedAt: date1,

			_password: "password",
			username: "admin",
		},
		{
			_id: 5,
			createdAt: date2,
			updatedAt: date2,

			_password: faker.internet.password({ length: 16 }),
			username: "user-forgot-password",
		},
	],
} as const satisfies Seed;
