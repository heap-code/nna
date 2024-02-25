import { Entity, MikroORM, Options, Property } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/sqlite";

import { EntityNumber, EntityString } from ".";

const ORM_TESTER = new (class {
	private readonly ORMs: MikroORM[] = [];

	public async getORM(entities: Options["entities"]) {
		const orm = await MikroORM.init(
			defineConfig({
				allowGlobalContext: true,
				connect: true,
				dbName: "file::memory:?cache=shared",
				entities,
				validate: true,
			}),
		);

		await orm.schema.updateSchema({ dropTables: true });
		this.ORMs.push(orm);
		return orm;
	}

	public async clean() {
		await Promise.all(this.ORMs.map(orm => orm.close(true)));
		this.ORMs.splice(0);
	}
})();

describe("Entity", () => {
	afterEach(() => ORM_TESTER.clean());

	it("should create simple entities", async () => {
		@Entity()
		class EntityTestNumber extends EntityNumber.Entity() {}
		@Entity()
		class EntityTestString extends EntityString.Entity({
			_id: { onCreate: () => "uuid" },
		}) {}

		const { em } = await ORM_TESTER.getORM([
			EntityTestNumber,
			EntityTestString,
		]);

		const now = Date.now();
		const entityN0 = em.create(EntityTestNumber, {});
		const entityN1 = em.create(EntityTestNumber, {});
		const entityS = em.create(EntityTestString, {});
		await em.flush();

		// Verify types
		expect(typeof entityN0._id === "number").toBe(true);
		expect(typeof entityS._id === "string").toBe(true);
		expect(entityN0.createdAt).toBeInstanceOf(Date);
		expect(entityS.updatedAt).toBeInstanceOf(Date);

		expect(entityN0._id).toBe(1);
		expect(entityN1._id).toBe(2);
		expect(entityS._id).toBe("uuid");

		for (const entity of [entityN0, entityN1, entityS]) {
			expect(entity.createdAt.getTime()).toBeGreaterThanOrEqual(now);
			expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(now);
			expect(entity.createdAt.getTime()).toBeLessThanOrEqual(now + 50);
			expect(entity.updatedAt.getTime()).toBeLessThanOrEqual(now + 50);
		}
	});

	it("should, with defaults, only update date when there is a change", async () => {
		@Entity()
		class EntityTest extends EntityNumber.Entity() {
			@Property()
			public value!: number;
		}

		const { em } = await ORM_TESTER.getORM([EntityTest]);

		const entity0 = em.create(EntityTest, { value: 0 });
		await em.flush();

		// Spread to remove links from the 'unit-of-work'
		const { ...entity } = entity0;
		expect(entity._id).toBe(1);
		expect(entity.value).toBe(0);

		// Nothing updated
		const updated0 = em.assign(entity0, {});
		await em.flush();
		expect(updated0._id).toBe(entity._id);
		expect(updated0.value).toBe(entity.value);
		expect(updated0.createdAt.getTime()).toBe(entity.createdAt.getTime());
		expect(updated0.updatedAt.getTime()).toBe(entity.updatedAt.getTime());

		// Something updated
		const updated1 = em.assign(entity0, { value: 10 });
		await em.flush();
		expect(updated1._id).toBe(entity._id);
		expect(updated1.value).not.toBe(entity.value);
		expect(updated1.createdAt.getTime()).toBe(entity.createdAt.getTime());
		expect(updated1.updatedAt.getTime()).toBeGreaterThan(
			entity.updatedAt.getTime(),
		);
	});

	it("should override default options", async () => {
		const customDate = new Date();
		customDate.setFullYear(2000);

		@Entity()
		class EntityTest0 extends EntityNumber.Entity({
			updatedAt: { onCreate: () => customDate },
		}) {}

		const { em } = await ORM_TESTER.getORM([EntityTest0]);
		const entity = em.create(EntityTest0, {});
		await em.flush();

		expect(entity.updatedAt.getTime()).toBe(customDate.getTime());
	});
});
