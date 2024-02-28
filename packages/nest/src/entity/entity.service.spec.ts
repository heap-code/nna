import { Entity, Opt } from "@mikro-orm/core";
import { MikroORM, defineConfig } from "@mikro-orm/sqlite";
import { ModelPrimaryKey } from "@nna/core";

import { EntityNumber, EntityString } from "./entities";
import { EntityService } from "./entity.service";

@Entity()
class EntityA extends EntityNumber.Entity() {
	public name!: string;
	public parentId!: Opt<EntityA[ModelPrimaryKey] | null>;
}
@Entity()
class EntityB extends EntityString.Entity({
	_id: { onCreate: () => Date.now().toString() },
}) {
	public aId!: Opt<EntityA[ModelPrimaryKey] | null>;
}

type EntityACreate = Pick<EntityA, "name" | "parentId">;
type EntityBCreate = Pick<EntityB, "aId">;

abstract class EntityAService extends EntityService<
	EntityA,
	EntityACreate,
	Partial<EntityACreate>
> {}
abstract class EntityBService extends EntityService<
	EntityB,
	EntityBCreate,
	Partial<EntityBCreate>
> {}

describe("EntityService", () => {
	let orm: MikroORM;

	let serviceA: EntityAService;
	let serviceB: EntityBService;

	beforeAll(async () => {
		orm = await MikroORM.init(
			defineConfig({
				allowGlobalContext: true,
				connect: true,
				dbName: "file::memory:?cache=shared",
				entities: [EntityA, EntityB],
				validate: true,
			}),
		);
	});

	beforeEach(async () => {
		await orm.schema.updateSchema({ dropTables: true });
		const { em } = orm;

		const repositoryA = em.getRepository(EntityA);
		const repositoryB = em.getRepository(EntityB);

		serviceA = new (class _ extends EntityAService {
			public constructor() {
				super(repositoryA);
			}
		})();
		serviceB = new (class _ extends EntityBService {
			public constructor() {
				super(repositoryB);
			}
		})();
	});

	afterAll(() => orm.close(true));

	it("should be done", () => {
		expect(false).toBe(true);
	});
});
