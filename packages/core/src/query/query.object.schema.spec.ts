import type { QueryFilter } from ".";
import { Options } from "./options/options";

/** An object with all parameters and options for a query */
export interface QueryObject<T> extends Options<T> {
	/** Filter the data */
	where?: QueryFilter<T>;
}
