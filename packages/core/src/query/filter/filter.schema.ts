import * as z from "zod";

import { Filter, FilterLogicalOperatorMap } from "./filter";
import * as FilterObject from "./filter-object.schema";
import { QueryObjectSchema } from "../query.types";

/** Options to create a query filter validation schema */
export type FilterOptions = FilterObject.ObjectOptions;

/**
 * Creates a query validation schema for an object schema.
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: FilterOptions,
) {
	const filterSchema: z.ZodType<Filter<z.infer<T>>> = z.intersection(
		// First element is the `FilterObject`
		z.preprocess(
			arg => {
				// Remove the operators from the object
				//	so they do not fail the FilterObject strict validation
				const {
					$and: _0,
					$not: _1,
					$or: _2,
					...val
				} = arg as Filter<z.infer<T>>;

				return val;
			},
			FilterObject.object(schema, options),
		),
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
