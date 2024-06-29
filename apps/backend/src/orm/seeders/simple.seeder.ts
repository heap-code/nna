import { Seeds } from "~/testing/seeds";

import { SeedDataSeeder } from "./seed-data/seed-data.seeder";

const seed = Seeds.simple;
export class SimpleSeeder extends SeedDataSeeder<typeof seed> {
	public constructor() {
		super(seed);
	}
}
