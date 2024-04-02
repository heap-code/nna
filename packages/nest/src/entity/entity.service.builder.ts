import { EntityRepository } from "@mikro-orm/core";
import { ModelBase, ModelPrimaryKey } from "@nna/core";

import {
	EntityService,
	EntityToCreate,
	type EntityServiceWithCreate,
	type EntityServiceWithDelete,
	type EntityServiceWithUpdate,
	EntityToUpdate,
} from "./entity.service";

/** @internal */
type Abstract<T extends ModelBase, Service> = Omit<
	typeof EntityService,
	"prototype"
> &
	(abstract new (repository: EntityRepository<T>) => Service) & {
		prototype: Service;
	};

/** @internal */
declare abstract class AbstractServiceWithToCreate<
	T extends ModelBase,
	ToCreate,
> {
	// Used as an "interface with abstract methods"

	/**
	 * Transforms the {@link ToCreate} data into a valid object for the ORM {@link EntityRepository repository}.
	 *
	 * @param toCreate data to transform
	 * @returns data for the {@link EntityRepository repository}
	 */
	protected abstract transformToCreate(
		toCreate: ToCreate,
	): EntityToCreate<T> | Promise<EntityToCreate<T>>;
}
/** @internal */
declare abstract class AbstractServiceWithUpdate<
	T extends ModelBase,
	ToUpdate,
> {
	// Used as an "interface with abstract methods"

	/**
	 * Transforms the {@link ToUpdate} data into a valid object for the ORM {@link EntityRepository repository}.
	 *
	 * @param id of the entity to update
	 * @param toUpdate data to update
	 * @returns data for the {@link EntityRepository repository}
	 */
	protected abstract transformToUpdate(
		id: T[ModelPrimaryKey],
		toUpdate: ToUpdate,
	): EntityToUpdate<T> | Promise<EntityToUpdate<T>>;
}

/** @see entityServiceBuilder */
class EntityServiceBuilder<
	T extends ModelBase,
	const ServiceClass extends EntityService<T>,
> {
	/**
	 * Create a {@link EntityServiceBuilder}
	 *
	 * @returns a {@link EntityServiceBuilder}
	 */
	public static create<T extends ModelBase>() {
		return new EntityServiceBuilder<T, EntityService<T>>(
			EntityService as never,
		);
	}

	private constructor(private readonly _class: Abstract<T, ServiceClass>) {}

	/**
	 * Gets the class that has been built with his builder.
	 *
	 * Note: The methods does not build on-the-fly. So two `getClass` returns the same class
	 *
	 * @returns The "builded" class
	 */
	public getClass() {
		return this._class;
	}

	/**
	 * Adds the create functionality to the service class
	 *
	 * @returns a new builder with the added functionality
	 */
	public withCreate<const ToCreate>(): EntityServiceBuilder<
		T,
		AbstractServiceWithToCreate<T, ToCreate> &
			EntityServiceWithCreate<T, ToCreate> &
			ServiceClass
	> {
		type ServiceClassExtended =
			abstract new () => AbstractServiceWithToCreate<T, ToCreate> &
				EntityService<T>;
		abstract class ServiceWithCreate
			extends (this._class as never as ServiceClassExtended)
			implements EntityServiceWithCreate<T, ToCreate>
		{
			public async create(toCreate: ToCreate) {
				const created = this.repository.create(
					await this.transformToCreate(toCreate),
				);
				await this.repository.getEntityManager().flush();
				return this.findById(created._id);
			}
		}

		return new EntityServiceBuilder<T, never>(ServiceWithCreate as never);
	}

	/**
	 * Adds the update functionality to the service class
	 *
	 * @returns a new builder with the added functionality
	 */
	public withUpdate<const ToUpdate>(): EntityServiceBuilder<
		T,
		AbstractServiceWithUpdate<T, ToUpdate> &
			EntityServiceWithUpdate<T, ToUpdate> &
			ServiceClass
	> {
		type ServiceClassExtended =
			abstract new () => AbstractServiceWithUpdate<T, ToUpdate> &
				EntityService<T>;
		abstract class ServiceWithUpdate
			extends (this._class as never as ServiceClassExtended)
			implements EntityServiceWithUpdate<T, ToUpdate>
		{
			public async updateById(
				id: T[ModelPrimaryKey],
				toUpdate: ToUpdate,
			): Promise<T> {
				const entity = await this.findById(id);
				await this.repository.getEntityManager().persistAndFlush(
					this.repository.assign(
						entity as T,
						await this.transformToUpdate(id, toUpdate),
						{
							updateByPrimaryKey: true,
						},
					),
				);

				return this.findById(id);
			}
		}

		return new EntityServiceBuilder<T, never>(ServiceWithUpdate as never);
	}

	/**
	 * Adds the delete functionality to the service class
	 *
	 * @returns a new builder with the added functionality
	 */
	public withDelete(): EntityServiceBuilder<
		T,
		EntityServiceWithDelete<T> & ServiceClass
	> {
		abstract class ServiceWithDelete
			extends (this._class as typeof EntityService<T>)
			implements EntityServiceWithDelete<T>
		{
			public async deleteById(id: T[ModelPrimaryKey]): Promise<T> {
				const entity = await this.findById(id);
				await this.repository.getEntityManager().removeAndFlush(entity);
				return entity;
			}
		}

		return new EntityServiceBuilder<T, never>(ServiceWithDelete as never);
	}

	/**
	 * Adds the CUD (Create, Update, Delete) functionalities to the service class
	 *
	 * @returns a new builder with the added functionality
	 */
	public withCUD<const ToCreate, const ToUpdate>() {
		return this.withCreate<ToCreate>().withUpdate<ToUpdate>().withDelete();
	}
}

/**
 * This builder creates a class with CUD functionality.
 * It then can be extended for an injectable NestJS Provider.
 *
 * Utility: It is possible to create a service that only creates and deletes entities,
 * but can not update them, at least not with the default implementation.
 *
 * @example
 * import { Injectable } from "@nestjs/common";
 *
 * \\@Injectable()
 * export class UserService extends entityServiceBuilder()
 * 	.withCreate<number>()
 * 	.withDelete()
 * 	.getClass() {
 * 	protected override transformToCreate(toCreate: number) {
 * 		if (0 < toCreate) {
 * 			return {};
 * 		}
 *
 * 		return {};
 * 	}
 * }
 */
export const entityServiceBuilder =
	EntityServiceBuilder.create.bind(EntityServiceBuilder);
