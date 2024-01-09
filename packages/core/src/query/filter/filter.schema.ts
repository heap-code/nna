import { z } from "zod";

import { Filter, FilterLogicalOperatorMap } from "./filter";
import * as FilterObject from "./filter-object.schema";

/** Options to create an query filter validation schema */
export type FilterOptions = FilterObject.ObjectOptions;

/**
 * Creates a query validation schema for an object schema.
 *
 * Be aware that, due to the intersection of the `FilterObject` and the logical operators (`$and`, `$or`, `$not`),
 * only the errors of one "side" of that intersection are returned (`FilterObject` first)
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function _schema<T extends FilterObject.ObjectSchema>(
	schema: T,
	options?: FilterOptions,
) {
	const filterSchema: z.ZodType<Filter<z.infer<T>>> = z.intersection(
		// First element is the `FilterObject`
		z.transformer(FilterObject.object(schema, options), {
			transform: ({ $and: _0, $not: _1, $or: _2, ...val }) => val,
			type: "preprocess",
		}),
		// Then the recursive type with the logical operators
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

export { _schema as filter };
