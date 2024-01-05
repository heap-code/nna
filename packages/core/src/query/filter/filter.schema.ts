import { z } from "zod";

import { Filter, FilterLogicalOperatorMap } from "./filter";
import * as FilterObject from "./filter-object.schema";

export type FilterOptions = FilterObject.ObjectOptions;

/**
 * TODO
 *
 * @param schema
 * @param options
 */
function schema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: FilterOptions,
) {
	const abc: z.ZodType<Filter<z.infer<T>>> = FilterObject.object(
		schema,
		options,
	).merge(
		z
			.object({
				$and: z.array(z.lazy(() => abc)),
				$not: z.lazy(() => abc),
				$or: z.array(z.lazy(() => abc)),
			} satisfies Record<
				keyof FilterLogicalOperatorMap<never>,
				z.ZodType
			>)
			.partial(),
	);

	return abc;
}

export { schema as filter };
