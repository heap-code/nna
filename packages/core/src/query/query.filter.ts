import type { OperatorMap } from "@mikro-orm/core/typings";

export type QueryFilterValue<T> =
	| Omit<OperatorMap<T>, "$and" | "$not" | "$or">
	| T;

export type QueryFilterObject<T> = {
	[P in keyof T]?: T[P] extends Date
		? QueryFilterValue<T[P]>
		: T[P] extends object
			? QueryFilterObject<T[P]>
			: QueryFilterValue<T[P]>;

	// TODO: (incomplete)
};

export interface QueryFilterLogicalOperators<T> {
	$and?: ReadonlyArray<QueryFilter<T>>;
	$not?: QueryFilter<T>;
	$or?: ReadonlyArray<QueryFilter<T>>;
}

export type QueryFilter<T> = QueryFilterLogicalOperators<T> &
	QueryFilterObject<T>;
