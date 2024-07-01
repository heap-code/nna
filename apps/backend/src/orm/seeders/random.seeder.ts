import { Seeds } from "~/testing/seeds";

import { SeedDataBaseSeeder } from "./seed-data";

export class RandomSeeder extends SeedDataBaseSeeder {
	public constructor(public options?: Seeds.RandomOptions) {
		super();
	}

	public override getSeed() {
		return Seeds.random(this.options);
	}
}
