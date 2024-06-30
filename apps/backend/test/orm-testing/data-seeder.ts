import { MikroORM } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { SeedData, SeedGenerator } from "~/testing/seeds";

import { SeedDataBaseSeeder } from "../../src/orm/seeders/seed-data";

@Injectable()
export class DataSeeder {
	public constructor(private readonly orm: MikroORM) {}

	public async seed<const T extends SeedData>(seed: T): Promise<T> {
		const { em, schema, seeder } = this.orm;

		em.clear();
		await schema.refreshDatabase();
		await seeder.seed(
			class extends SeedDataBaseSeeder {
				public getSeed = () => seed;
			},
		);

		return seed;
	}

	public generate: SeedGenerator.Generate = async param => {
		const seed = await SeedGenerator.generate(param);
		return this.seed(seed);
	};
}
