import * as z from "zod";

import type { QueryObjectSchema, QueryOptions } from "..";
import { FilterOptions } from "../filter";
import * as QueryOrder from "../order";

/** Options to create a query options validation schema */
export type QueryOptionsOptions = Pick<FilterOptions, "coerce" | "strict">;

/**
 * Creates a {@link Options query options} validation schema for an object schema.
 *
 * @param schema the object schema to create this {@link Options query options} schema
 * @param options for the creation of the schema
 * @returns the {@link Options query options} validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: QueryOptionsOptions,
) {
	if (!options) {
		return _schema(schema, {});
	}

	type QryOptions = QueryOptions<z.infer<T>>;
	type QryOptShape = Record<keyof QryOptions, z.ZodType>;

	const { coerce = false } = options;
	const numberSchema = z.number({ coerce }).gte(0);

	return z
		.object({
			limit: numberSchema,
			order: z.array(z.lazy(() => QueryOrder.order(schema, options))),
			skip: numberSchema,
		} satisfies QryOptShape)
		.partial() satisfies z.ZodType<QryOptions>;
}

export { _schema as options };
