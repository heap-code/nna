import {
	EntityData,
	EntityRepository as EntityRepository,
	FromEntityType,
	RequiredEntityData,
} from "@mikro-orm/core";
import { ModelBase, ModelPrimaryKey } from "@nna/core";

import { EntityReadonlyService } from "./entity.readonly-service";

/**
 * Base class for an entityService.
 * Use the {@link entityServiceBuilder} to create a complete service
 */
export abstract class EntityService<
	T extends ModelBase,
	Repository extends EntityRepository<T> = EntityRepository<T>,
> extends EntityReadonlyService<T, Repository> {}

/** Type for `ToCreate` template type in {@link EntityServiceWithCreate} */
export type EntityToCreate<T extends ModelBase> = RequiredEntityData<T>;
/** Type for `ToUpdate` template type in {@link EntityServiceWithUpdate} */
export type EntityToUpdate<T extends ModelBase> = EntityData<FromEntityType<T>>;

/** An {@link EntityService} with create functionality */
export interface EntityServiceWithCreate<
	T extends ModelBase,
	ToCreate = EntityToCreate<T>,
> {
	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @returns The created entity persisted in the database
	 */
	create(toCreate: ToCreate): Promise<T>;
}

/** An {@link EntityService} with update functionality */
export interface EntityServiceWithUpdate<
	T extends ModelBase,
	ToUpdate = EntityToUpdate<T>,
> {
	/**
	 * Updates an existing entity
	 *
	 * @param id of the entity to update
	 * @param toUpdate Object to update
	 * @returns The updated entity
	 */
	updateById(id: T[ModelPrimaryKey], toUpdate: ToUpdate): Promise<T>;
}

/** An {@link EntityService} with delete functionality */
export interface EntityServiceWithDelete<T extends ModelBase> {
	/**
	 * Deletes an existing entity
	 *
	 * @param id of the entity to delete
	 * @returns The deleted entity (before deletion)
	 */
	deleteById(id: T[ModelPrimaryKey]): Promise<T>;
}

export { entityServiceBuilder } from "./entity.service.builder";
