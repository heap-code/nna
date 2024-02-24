import { Entity, MikroORM } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/sqlite";

import { EntityNumber, EntityString } from ".";

describe("Entity", () => {
	describe("Entity number", () => {
		@Entity()
		class EntityTest extends EntityNumber.Entity() {}
		it("asd", async () => {
			const a = await MikroORM.init(
				defineConfig({
					clientUrl: "test",
					connect: true,
					entities: [EntityTest],
				}),
			);

			console.log("aaa", a);
		});
	});

	describe("Entity string", () => {
		class EntityTest extends EntityString.Entity() {}
	});
});
