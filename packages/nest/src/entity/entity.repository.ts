import {
	EntityData,
	EntityRepository as OrmEntityRepository,
	RequiredEntityData,
} from "@mikro-orm/core";
import { ModelBase, ModelPrimaryKey } from "@nna/core";

import { EntityReadonlyRepository } from "./entity.readonly-repository";

export abstract class EntityRepository<
	T extends ModelBase,
	Repository extends OrmEntityRepository<T> = OrmEntityRepository<T>,
> extends EntityReadonlyRepository<T, Repository> {
	protected constructor(repository: Repository) {
		super(repository);
	}

	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @returns The created entity persisted in the database
	 */
	public async create(toCreate: RequiredEntityData<T>): Promise<T> {
		const created = this.ormRepository.create(toCreate);
		await this.ormRepository.getEntityManager().flush();
		return this.findById(created._id);
	}

	/**
	 * Updates an existing entity
	 *
	 * @param id of the entity to update
	 * @param toUpdate Object to update
	 * @returns The updated entity
	 */
	public async updateById(
		id: T[ModelPrimaryKey],
		toUpdate: EntityData<T>,
	): Promise<T> {
		const entity = await this.findById(id);
		await this.ormRepository.getEntityManager().persistAndFlush(
			this.ormRepository.assign(entity, toUpdate as never, {
				updateByPrimaryKey: true,
			}),
		);

		return this.findById(id);
	}

	/**
	 * Deletes an existing entity
	 *
	 * @param id of the entity to delete
	 * @returns The deleted entity (before deletion)
	 */
	public async deleteById(id: T[ModelPrimaryKey]): Promise<T> {
		const entity = await this.findById(id);
		await this.ormRepository.getEntityManager().removeAndFlush(entity);
		return entity;
	}
}
