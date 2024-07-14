import { Seeds } from "~/testing/seeds";

import { SeedDataSeeder } from "./seed-data/seed-data.seeder";

/** Seed to use */
const seed = Seeds.simple;

/** Seeder for {@link seed} */
export class SimpleSeeder extends SeedDataSeeder<typeof seed> {
	/** Creates the seeder with its {@link seed} */
	public constructor() {
		super(seed);
	}
}
