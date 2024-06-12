import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { SeedData } from "~/testing/seeds";

/** Seed the database with a {@link SeedData} */
export abstract class SeedDataBaseSeeder<
	T extends SeedData = SeedData,
> extends Seeder {
	/**
	 * Gets the data to seed
	 *
	 * @returns the data to seed
	 */
	public abstract getSeed(): T;

	/** @inheritDoc */
	public override run(em: EntityManager) {
		const seed: SeedData = this.getSeed();

		throw new Error("TODO");
	}
}
