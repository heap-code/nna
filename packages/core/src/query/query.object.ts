import { QueryFilter } from "./filter";
import { QueryOptions } from "./query.options";

/** An object with all parameters and options for a query */
export interface QueryObject<T> extends QueryOptions<T> {
	/** Filter the data */
	where?: QueryFilter<T>;
}
