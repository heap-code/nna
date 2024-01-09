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
function _schema<T extends FilterObject.ObjectSchema>(
	schema: T,
	options?: FilterOptions,
) {
	// TODO: better

	const fff = FilterObject.object(schema, options);
	const obj = z.transformer(fff, {
		transform: ({ $and: _0, $not: _1, $or: _2, ...val }) => val,
		type: "preprocess",
	});

	const filterSchema: z.ZodType<Filter<z.infer<T>>> = z
		.custom()
		.transform((val, ctx) => {
			const abc0 = obj.safeParse(val);
			const abc1 = z
				.object({
					$and: z.array(z.lazy(() => filterSchema)),
					$not: z.lazy(() => filterSchema),
					$or: z.array(z.lazy(() => filterSchema)),
				} satisfies Record<
					keyof FilterLogicalOperatorMap<never>,
					z.ZodType
				>)
				.partial()
				.safeParse(val);

			const i = [
				...(abc0.success ? [] : abc0.error.issues),
				...(abc1.success ? [] : abc1.error.issues),
			];

			for (const f of i) {
				ctx.addIssue(f);
			}

			return val;
		})
		.pipe(
			z.intersection(
				obj,
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
			),
		);

	return filterSchema;
}

export { _schema as filter };
