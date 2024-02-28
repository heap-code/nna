import { EntityRepository } from "@mikro-orm/core";
import {
	ModelPrimaryKey,
	ModelBase,
	QueryFilter,
	QueryOptions,
	QueryResults,
	QueryFilterObject,
} from "@nna/core";

export abstract class EntityReadonlyService<
	T extends ModelBase,
	Repository extends EntityRepository<T> = EntityRepository<T>,
> {
	protected constructor(protected readonly repository: Repository) {}

	/**
	 * Find many entities and count them
	 *
	 * @param where Filter to apply
	 * @param options Additional parameters to sort and/or paginate
	 * @returns All entities found with its pagination
	 */
	public findAndCount(
		where: QueryFilter<T>,
		options: QueryOptions<T> = {},
	): Promise<QueryResults<T>> {
		const offset = options.skip ?? 0;
		return this.repository
			.findAndCount(where as never, { offset })
			.then(([data, total]) => ({
				data,
				pagination: {
					range: { end: offset + data.length, start: offset },
					total,
				},
			}));
	}

	/**
	 * Count entities
	 *
	 * @param where Filter to apply
	 * @returns The count of the entities found
	 */
	public count(where: QueryFilter<T> = {}) {
		return this.findAndCount(where, { limit: 0 }).then(
			({ pagination: { total } }) => total,
		);
	}

	/**
	 * Find one entity by a filter.
	 * Throws a Mikro-orm error when not found
	 *
	 * @param where filter
	 * @returns The found entity
	 */
	public findOne(where: QueryFilter<T>) {
		return this.repository.findOneOrFail(where as never);
	}

	/**
	 * Find one entity by its id
	 *
	 * @param id of the entity to find
	 * @returns The found entity
	 */
	public findById(id: T[ModelPrimaryKey]) {
		return this.findOne({
			_id: id,
		} satisfies QueryFilterObject<ModelBase> as never);
	}
}
