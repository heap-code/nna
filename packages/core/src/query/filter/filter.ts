import type { OperatorMap } from "@mikro-orm/core/typings";

export type FilterValueOperatorMap<T> = Omit<
	OperatorMap<T>,
	"$and" | "$contained" | "$contains" | "$ilike" | "$not" | "$or" | "$overlap"
>;

export type FilterValue<T> = FilterValueOperatorMap<T> | T;

export type FilterObject<T> = {
	[P in keyof T]?: T[P] extends Date
		? FilterValue<T[P]>
		: T[P] extends object
			? FilterObject<T[P]>
			: FilterValue<T[P]>;

	// TODO: (currently incomplete)
};

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

/** Filter type to use at the root */
export type Filter<T> = FilterLogicalOperatorMap<T> & FilterObject<T>;
