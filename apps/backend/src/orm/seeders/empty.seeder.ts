import { SEEDS } from "~/testing/seeds";

import { SeedDataSeeder } from "./seed-data/seed-data.seeder";

const seed = SEEDS.empty;
export class EmptySeeder extends SeedDataSeeder<typeof seed> {
	public constructor() {
		super(seed);
	}
}
