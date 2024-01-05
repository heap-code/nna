import { z } from "zod";

import { Filter, FilterLogicalOperatorMap } from "./filter";
import * as FilterObject from "./filter-object.schema";

/** Options to create an query filter validation schema */
export type FilterOptions = FilterObject.ObjectOptions;

/**
 * Creates a query validation schema for an object schema
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function schema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: FilterOptions,
) {
	const filterSchema: z.ZodType<Filter<z.infer<T>>> = FilterObject.object(
		schema,
		options,
	).merge(
		z
			.object({
				$and: z.array(z.lazy(() => filterSchema)),
				$not: z.lazy(() => filterSchema),
				$or: z.array(z.lazy(() => filterSchema)),
			} satisfies Record<
				keyof FilterLogicalOperatorMap<never>,
				z.ZodType
			>)
			.partial(),
	);

	return filterSchema;
}

export { schema as filter };
