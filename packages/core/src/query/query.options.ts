import { QueryOrder } from "./query.order";

/** Options when looking for data */
export interface QueryOptions<T> {
	/**
	 * Limit the number of data returned.
	 *
	 * Use `0` to count only.
	 */
	limit?: number;
	/**
	 * Order the data.
	 *
	 * The order of the array defines the ordering
	 */
	order?: ReadonlyArray<QueryOrder<T>>;
	/** Skip some data */
	skip?: number;
}
