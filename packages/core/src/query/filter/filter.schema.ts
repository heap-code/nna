import { z } from "zod";

import { Filter, FilterLogicalOperatorMap } from "./filter";
import {
	CreateFilterObjectSchemaOptions,
	createFilterObjectSchema,
} from "./filter-object.schema";

export type CreateFilterSchemaOptions = CreateFilterObjectSchemaOptions;

/**
 * TODO
 *
 * @param schema
 * @param options
 */
export function createFilterSchema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: CreateFilterSchemaOptions,
) {
	const abc: z.ZodType<Filter<z.infer<T>>> = createFilterObjectSchema(
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
