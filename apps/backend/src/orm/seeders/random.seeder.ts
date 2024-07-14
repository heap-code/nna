import { Seeds } from "~/testing/seeds";

import { SeedDataBaseSeeder } from "./seed-data";

/** Seeder for "a lot" of random data */
export class RandomSeeder extends SeedDataBaseSeeder {
	/**
	 * Create a seeder for random data
	 *
	 * @param options Default options
	 */
	public constructor(public options?: Seeds.RandomOptions) {
		super();
	}

	/** @inheritDoc */
	public override getSeed() {
		return Seeds.random(this.options);
	}
}
