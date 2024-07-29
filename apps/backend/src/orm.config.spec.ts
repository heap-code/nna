import { CLIHelper } from "@mikro-orm/cli";
import { MikroORM } from "@mikro-orm/core";

describe("ORM config", () => {
	let orm: MikroORM;
	beforeAll(async () => (orm = await CLIHelper.getORM()));
	afterAll(() => orm.close());

	it("should load from configuration (CLI)", () => {
		const { config, seeder } = orm;
		expect(config.getAll().entities).not.toHaveLength(0);
		// Exist with CLI
		expect(seeder).toBeDefined();
	});
});
