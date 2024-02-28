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
	public create(toCreate: ToCreate) {
		throw new Error("TODO");
	}

	/**
	 * Updates an existing entity
	 *
	 * @param id of the entity to update
	 * @param toUpdate Object to update
	 * @returns The updated entity
	 */
	public updateById(id: T[ModelPrimaryKey], toUpdate: ToUpdate) {
		throw new Error("TODO");
	}

	/**
	 * Deletes an existing entity
	 *
	 * @param id of the entity to delete
	 * @returns The deleted entity (before deletion)
	 */
	public deleteById(id: T[ModelPrimaryKey]) {
		throw new Error("TODO");
	}
}
