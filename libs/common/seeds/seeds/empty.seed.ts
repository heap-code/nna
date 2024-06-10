import { Seed } from "../lib";

/** (Almost) empty data */
export const empty = {
	groups: [],
	persons: [],
	users: [],
} as const satisfies Seed;
