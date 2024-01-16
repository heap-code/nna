import type { QueryFilter, QueryOptions } from ".";

/** An object with all parameters and options for a query */
export interface QueryObject<T> extends QueryOptions<T> {
	/** Filter the data */
	filter?: QueryFilter<T>;
}
