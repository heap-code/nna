import { EntityRepository as OrmEntityRepository } from "@mikro-orm/core";
import {
	ModelPrimaryKey,
	ModelBase,
	QueryFilter,
	QueryOptions,
	QueryResults,
	QueryFilterObject,
} from "@nna/core";

import { EntityQueryOrders } from "./entity.query-order";

export abstract class EntityReadonlyRepository<
	T extends ModelBase,
	Repository extends OrmEntityRepository<T> = OrmEntityRepository<T>,
> {
	/**
	 * Converts the default results format from a query given by `mikro-orm`
	 * to a {@link QueryResults} object.
	 *
	 * @param results given by `mikro-orm`
	 * @param offset that has been applied to the query
	 * @returns {QueryResults} object of the results
	 */
	public static toQueryResults<const T>(
		results: [T[], number],
		offset: number,
	): QueryResults<T> {
		const [data, total] = results;

		return {
			data,
			pagination: {
				range: { end: offset + data.length, start: offset },
				total,
			},
		};
	}

	protected constructor(protected readonly ormRepository: Repository) {}

	/**
	 * Find many entities and count them
	 *
	 * @param where Filter to apply
	 * @param options Additional parameters to sort and/or paginate
	 * @returns All entities found with its pagination
	 */
	public findAndCount(
		where: QueryFilter<T> = {},
		options: QueryOptions<T> = {},
	): Promise<QueryResults<T>> {
		const { limit, order = [], skip = 0 } = options;

		return this.ormRepository
			.findAndCount(where as never, {
				limit,
				offset: skip,
				orderBy: order.map(EntityQueryOrders.fromQueryOrder),
			})
			.then(res => EntityReadonlyRepository.toQueryResults(res, skip));
	}

	/**
	 * Find many entities
	 *
	 * @see findAndCount to also get the pagination
	 * @param where Filter to apply
	 * @param options Additional parameters to sort and/or paginate
	 * @returns All entities found
	 */
	public findAll(
		where: QueryFilter<T> = {},
		options: QueryOptions<T> = {},
	): Promise<T[]> {
		return this.findAndCount(where, options).then(({ data }) => data);
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
		return this.ormRepository.findOneOrFail(where as never);
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
