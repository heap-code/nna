import {
	Collection,
	Entity,
	EntityData,
	EntityRef,
	ManyToOne,
	OneToMany,
	Property,
	RequiredEntityData,
} from "@mikro-orm/core";
import { MikroORM, defineConfig } from "@mikro-orm/sqlite";
import { QueryResultsPagination } from "@nna/core";

import { entityServiceBuilder } from "./entity.service.builder";
import { ORM_DEFAULT_CONFIGURATION } from "../../orm/orm.default-config";
import { EntityNumber, EntityString } from "../entities";

@Entity()
class GroupEntity extends EntityString.Entity({
	_id: { onCreate: () => Date.now().toString() },
}) {
	@Property()
	public name!: string;

	// A group can be contain by another
	@ManyToOne(() => GroupEntity, { default: null, nullable: true, ref: true })
	public parent!: EntityRef<GroupEntity> | null;

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
	public group!: EntityRef<GroupEntity>;
}

class GroupService extends entityServiceBuilder<GroupEntity>()
	.withCUD()
	.getClass() {
	protected override transformToCreate(
		toCreate: RequiredEntityData<GroupEntity>,
	) {
		return toCreate;
	}
	protected override transformToUpdate(
		_: GroupEntity,
		toUpdate: EntityData<GroupEntity>,
	) {
		return toUpdate;
	}
}
class UserService extends entityServiceBuilder<UserEntity>()
	.withCUD()
	.getClass() {
	protected override transformToCreate(
		toCreate: RequiredEntityData<UserEntity>,
	) {
		return toCreate;
	}
	protected override transformToUpdate(
		_: UserEntity,
		toUpdate: EntityData<UserEntity>,
	) {
		return toUpdate;
	}
}

describe("EntityRepository", () => {
	let orm: MikroORM;
	let groupService: GroupService, userService: UserService;

	beforeEach(async () => {
		orm = await MikroORM.init(
			defineConfig({
				...ORM_DEFAULT_CONFIGURATION,
				allowGlobalContext: true,
				connect: true,
				dbName: ":memory:",
				entities: [GroupEntity, UserEntity],
			}),
		);

		const { em, schema } = orm;
		await schema.createSchema();

		groupService = new GroupService(em.getRepository(GroupEntity));
		userService = new UserService(em.getRepository(UserEntity));
	});

	afterEach(() => orm.close(true));

	it("should create, read, update and delete entities (basic case)", async () => {
		const group1 = await groupService.create({ name: "group1" });
		const group2 = await groupService.create({ name: "group2" });
		const group21 = await groupService.create({
			name: "group2.1",
			parent: group2,
		});

		const user1 = await userService.create({
			group: group1,
			name: "user1",
		});
		const user2 = await userService.create({
			group: group1,
			name: "user2",
		});

		expect(user1.group._id).toBe(group1._id);
		expect(user2.group._id).toBe(group1._id);

		await userService.updateById(user2._id, { group: group21 });
		expect(user1.group._id).toBe(group1._id);
		expect(user2.group._id).toBe(group21._id);

		await group1.users.load({ refresh: true });
		expect(group1.users).toHaveLength(1);

		await userService.deleteById(user1._id);

		await group1.users.load({ refresh: true });
		expect(group1.users).toHaveLength(0);
	});

	it("should findMany and count (basic case)", async () => {
		const createdGroup1 = await groupService.create({ name: "group1" });
		const createdGroup2 = await groupService.create({
			name: "group2",
			parent: createdGroup1,
		});

		const createdUser1 = await userService.create({
			group: createdGroup1,
			name: "user1",
		});
		const createdUser2 = await userService.create({
			group: createdGroup2,
			name: "user2",
		});

		orm.em.clear();

		expect(await userService.findAll({}, { limit: 1 })).toHaveLength(1);

		expect(await userService.count()).toBe(2);
		expect(
			await userService.count({ group: { name: createdGroup1.name } }),
		).toBe(1);

		await groupService.findAndCount().then(({ data: [group1, group2] }) => {
			expect(group1._id).toBe(createdGroup1._id);
			expect(group2._id).toBe(createdGroup2._id);
		});
		await groupService
			.findAll(undefined, { order: [{ name: "desc" }] })
			.then(([group2, group1]) => {
				expect(group1._id).toBe(createdGroup1._id);
				expect(group2._id).toBe(createdGroup2._id);
			});

		await userService
			.findAndCount(undefined, { skip: 1 })
			.then(({ data: [user2], pagination }) => {
				expect(user2._id).toBe(createdUser2._id);
				expect(pagination).toStrictEqual({
					range: { end: 2, start: 1 },
					total: 2,
				} satisfies QueryResultsPagination);
			});
		await userService.findAll().then(([user1, user2]) => {
			expect(user1._id).toBe(createdUser1._id);
			expect(user2._id).toBe(createdUser2._id);
		});
	});
});
