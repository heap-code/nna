import { Entity, Opt, Property } from "@mikro-orm/core";
import { MikroORM, defineConfig } from "@mikro-orm/sqlite";
import { ModelPrimaryKey } from "@nna/core";

import { EntityNumber, EntityString } from "./entities";
import { EntityService } from "./entity.service";

@Entity()
class EntityA extends EntityNumber.Entity() {
	@Property({ nullable: false })
	public name!: string;

	@Property({ default: null, nullable: true })
	public parentId!: Opt<EntityA[ModelPrimaryKey]> | null;

	public parent?: EntityA;
}
@Entity()
class EntityB extends EntityString.Entity({
	_id: { onCreate: () => Date.now().toString() },
}) {
	@Property({ nullable: true })
	public aId!: Opt<EntityA[ModelPrimaryKey] | null>;
}

type EntityAToCreate = Pick<EntityA, "name" | "parentId">;
type EntityAToUpdate = Partial<EntityAToCreate>;
type EntityBToCreate = Pick<EntityB, "aId">;
type EntityBToUpdate = Partial<EntityBToCreate>;

abstract class EntityAService extends EntityService<
	EntityA,
	EntityAToCreate,
	EntityAToUpdate
> {}
abstract class EntityBService extends EntityService<
	EntityB,
	EntityBToCreate,
	EntityBToUpdate
> {}

describe("EntityService", () => {
	let orm: MikroORM;
	let serviceA: EntityAService, serviceB: EntityBService;

	beforeAll(async () => {
		orm = await MikroORM.init(
			defineConfig({
				allowGlobalContext: true,
				connect: true,
				dbName: "file::memory:",
				entities: [EntityA, EntityB],
				validate: true,
			}),
		);
	});

	beforeEach(async () => {
		await orm.schema.updateSchema({ dropDb: true });
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

	it("should, in a simple case, create, read, update and delete an entity", async () => {
		const toCreate: EntityAToCreate = { name: "1", parentId: null };
		const created = await serviceA.create(toCreate);
		expect(created.name).toBe(toCreate.name);
		expect(created.parentId).toBe(toCreate.parentId);

		expect(await serviceA.findById(created._id)).toStrictEqual(created);
		// No changes -> updated date should not change
		await serviceA.updateById(created._id, toCreate);
		expect(await serviceA.findById(created._id)).toStrictEqual(created);

		const toUpdate: EntityAToUpdate = { name: `${created.name}-1` };
		const updated = await serviceA.updateById(created._id, toUpdate);

		expect(updated._id).toBe(created._id);
		expect(updated.name).toBe(toUpdate.name);
		expect(updated.parentId).toBe(created.parentId);
		expect(updated.createdAt).toStrictEqual(created.createdAt);
		expect(updated.updatedAt.getTime()).toBeGreaterThan(
			created.updatedAt.getTime(),
		);

		const {
			data: [read],
			pagination: { total },
		} = await serviceA.findAndCount();
		expect(total).toBe(1);
		expect(read).toStrictEqual(updated);

		const deleted = await serviceA.deleteById(read._id);
		expect(deleted).toStrictEqual(read);

		expect(await serviceA.findAll()).toHaveLength(0);
	});
});
