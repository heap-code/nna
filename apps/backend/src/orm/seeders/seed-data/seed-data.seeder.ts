import { SeedData } from "~/testing/seeds";

import { SeedDataBaseSeeder } from "./seed-data.base.seeder";

/** Seeder with an initial {@link SeedData} */
export class SeedDataSeeder<
	const T extends SeedData,
> extends SeedDataBaseSeeder<T> {
	/**
	 * Creates a seeder with an initial {@link SeedData}
	 *
	 * @param seed to use in this seeder
	 */
	public constructor(private readonly seed: T) {
		super();
	}

	/** @inheritDoc */
	public override getSeed(): T {
		return this.seed;
	}
}
