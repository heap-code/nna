import { EntityRepository } from "@mikro-orm/core";
import { ModelBase, ModelPrimaryKey } from "@nna/core";

import { EntityReadonlyService } from "./entity.readonly-service";

export abstract class EntityService<
	T extends ModelBase,
	ToCreate,
	ToUpdate,
	Repository extends EntityRepository<T> = EntityRepository<T>,
> extends EntityReadonlyService<T, Repository> {
	protected constructor(repository: Repository) {
		super(repository);
	}

	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @returns The created entity persisted in the database
	 */
	public async create(toCreate: ToCreate): Promise<T> {
		const created = this.repository.create(toCreate as never);

		await this.repository.getEntityManager().flush();

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
		toUpdate: ToUpdate,
	): Promise<T> {
		const entity = await this.findById(id);
		await this.repository.getEntityManager().persistAndFlush(
			this.repository.assign(entity, toUpdate as never, {
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

		await this.repository.getEntityManager().removeAndFlush(entity);

		return entity;
	}
}
