import type { QueryOrder } from "..";

/** Options when looking for data */
export interface Options<T> {
	/** Limit the number of data returned. Use `0` to count only. */
	limit?: number;
	/** Order the data. The order of the array defines the ordering */
	order?: ReadonlyArray<QueryOrder<T>>;
	/** Skip some data */
	skip?: number;
}
