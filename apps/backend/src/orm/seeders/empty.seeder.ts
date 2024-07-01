import { Seeds } from "~/testing/seeds";

import { SeedDataSeeder } from "./seed-data/seed-data.seeder";

const seed = Seeds.empty;
export class EmptySeeder extends SeedDataSeeder<typeof seed> {
	public constructor() {
		super(seed);
	}
}
