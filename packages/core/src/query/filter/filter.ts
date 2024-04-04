import { FilterObject } from "./filter-object";

/** Logical operators for a filter */
export interface FilterLogicalOperatorMap<T> {
	/**
	 * All items are `AND` conditions
	 *
	 * @example
	 * const conditions: $and<Filter<{ a: number }>> = [{ a: 2 }, { b: 5 }];
	 * // => data.a === 2 && data.a === 5
	 */
	$and?: ReadonlyArray<Filter<T>>;
	/** Negate condition */
	$not?: Filter<T>;
	/**
	 * All items are `OR` conditions
	 *
	 * @example
	 * const conditions: $or<Filter<{ a: number }>> = [{ a: 2 }, { b: 5 }];
	 * // => data.a === 2 || data.a === 5
	 */
	$or?: ReadonlyArray<Filter<T>>;
}

/**
 * Filter type to use at the root.
 * Reduced QueryFilter from `mikro-orm`
 */
export type Filter<T> = FilterLogicalOperatorMap<T> & FilterObject<T>;
