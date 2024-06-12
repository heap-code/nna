import { SEEDS } from "~/testing/seeds";

import { SeedDataSeeder } from "./seed-data/seed-data.seeder";

const seed = SEEDS.simple;
export class SimpleSeeder extends SeedDataSeeder<typeof seed> {
	public constructor() {
		super(seed);
	}
}
