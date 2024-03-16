import {
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	Property,
	Ref,
} from "@mikro-orm/core";
import { MikroORM, defineConfig } from "@mikro-orm/sqlite";
import { QueryResultsPagination } from "@nna/core";

import { EntityNumber, EntityString } from "./entities";
import { EntityRepository } from "./entity.repository";
import { ORM_DEFAULT_CONFIGURATION } from "../orm/orm.default-config";

@Entity()
class GroupEntity extends EntityString.Entity({
	_id: { onCreate: () => Date.now().toString() },
}) {
	@Property()
	public name!: string;

	// A group can be contain by another
	@ManyToOne(() => GroupEntity, { default: null, nullable: true, ref: true })
	public parent!: Ref<GroupEntity> | null;

	@OneToMany(() => GroupEntity, ({ parent }) => parent)
	public readonly children = new Collection<GroupEntity>(this);

	// Users of the group
	@OneToMany(() => UserEntity, ({ group }) => group)
	public readonly users = new Collection<UserEntity>(this);
}

@Entity()
class UserEntity extends EntityNumber.Entity() {
	@Property()
	public name!: string;

	// A user is always part of a group
	@ManyToOne(() => GroupEntity, { ref: true })
	public group!: Ref<GroupEntity>;
}

abstract class GroupRepository extends EntityRepository<GroupEntity> {}
abstract class UserRepository extends EntityRepository<UserEntity> {}

describe("EntityRepository", () => {
	let orm: MikroORM;
	let groupRepository: GroupRepository, userRepository: UserRepository;

	beforeEach(async () => {
		orm = await MikroORM.init(
			defineConfig({
				...ORM_DEFAULT_CONFIGURATION,
				allowGlobalContext: true,
				connect: true,
				dbName: ":memory:",
				debug: true,
				entities: [GroupEntity, UserEntity],
			}),
		);

		const { em, schema } = orm;
		await schema.createSchema();

		groupRepository = new (class _ extends EntityRepository<GroupEntity> {
			public constructor() {
				super(em.getRepository(GroupEntity));
			}
		})();
		userRepository = new (class _ extends EntityRepository<UserEntity> {
			public constructor() {
				super(em.getRepository(UserEntity));
			}
		})();
	});

	afterAll(() => orm.close(true));

	it("should create, read, update and delete entities (basic case)", async () => {
		const group1 = await groupRepository.create({ name: "group1" });
		const group2 = await groupRepository.create({ name: "group2" });
		const group21 = await groupRepository.create({
			name: "group2.1",
			parent: group2,
		});

		const user1 = await userRepository.create({
			group: group1,
			name: "user1",
		});
		const user2 = await userRepository.create({
			group: group1,
			name: "user2",
		});

		expect(user1.group._id).toBe(group1._id);
		expect(user2.group._id).toBe(group1._id);

		await userRepository.updateById(user2._id, { group: group21 });
		expect(user1.group._id).toBe(group1._id);
		expect(user2.group._id).toBe(group21._id);

		await group1.users.load({ refresh: true });
		expect(group1.users).toHaveLength(1);

		await userRepository.deleteById(user1._id);

		await group1.users.load({ refresh: true });
		expect(group1.users).toHaveLength(0);
	});

	it("should findMany and count (basic case)", async () => {
		const createdGroup1 = await groupRepository.create({ name: "group1" });
		const createdGroup2 = await groupRepository.create({
			name: "group2",
			parent: createdGroup1,
		});

		const createdUser1 = await userRepository.create({
			group: createdGroup1,
			name: "user1",
		});
		const createdUser2 = await userRepository.create({
			group: createdGroup2,
			name: "user2",
		});

		orm.em.clear();

		expect(await userRepository.count()).toBe(2);
		expect(await userRepository.count({ name: createdUser1.name })).toBe(1);

		await groupRepository
			.findAndCount()
			.then(({ data: [group1, group2] }) => {
				expect(group1._id).toBe(createdGroup1._id);
				expect(group2._id).toBe(createdGroup2._id);
			});
		await groupRepository
			.findAll(undefined, { order: [{ name: "desc" }] })
			.then(([group2, group1]) => {
				expect(group1._id).toBe(createdGroup1._id);
				expect(group2._id).toBe(createdGroup2._id);
			});

		await userRepository
			.findAndCount(undefined, { skip: 1 })
			.then(({ data: [user2], pagination }) => {
				expect(user2._id).toBe(createdUser2._id);
				expect(pagination).toStrictEqual({
					range: { end: 2, start: 1 },
					total: 2,
				} satisfies QueryResultsPagination);
			});
		await userRepository.findAll().then(([user1, user2]) => {
			expect(user1._id).toBe(createdUser1._id);
			expect(user2._id).toBe(createdUser2._id);
		});
	});
});
