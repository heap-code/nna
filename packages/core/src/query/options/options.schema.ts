import * as z from "zod";

import type { QueryObjectSchema, QueryOptions, QueryOrderOptions } from "..";

/** Options to create a query options validation schema */
export type QueryOptionsOptions = QueryOrderOptions;

/**
 * Creates a [query options]{@link Options} validation schema for an object schema.
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the [query options]{@link Options} validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: QueryOptionsOptions,
) {
	if (!options) {
		return _schema(schema, options);
	}

	return z.object({}) satisfies z.ZodType<QueryOptions<z.infer<T>>>;
}

export { _schema as options };
