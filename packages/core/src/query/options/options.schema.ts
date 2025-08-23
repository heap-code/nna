import * as z from "zod";

import type { QueryObjectSchema } from "..";
import { FilterOptions } from "../filter";
import * as QueryOrder from "../order";

/** Default limit set to schema */
export const QUERY_OPTIONS_DEFAULT_LIMIT = 100;

/** Options to create a query options validation schema */
export interface QueryOptionsOptions
	extends Pick<FilterOptions, "coerce" | "strict"> {
	/**
	 * Default value for `limit` property.
	 *	`null` to not set any.
	 *
	 * @default QUERY_OPTIONS_LIMIT_DEFAULT
	 */
	defaultLimit?: number | null;
}

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

	const { coerce = false, defaultLimit = QUERY_OPTIONS_DEFAULT_LIMIT } =
		options;
	const numberSchema = (coerce ? z.coerce.number() : z.number())
		.gte(0)
		.optional();

	return z.object({
		limit: (defaultLimit === null
			? numberSchema
			: numberSchema.default(defaultLimit)) as typeof numberSchema,
		order: z
			.array(z.lazy(() => QueryOrder.order(schema, options)))
			.optional(),
		skip: numberSchema,
	});
}

export { _schema as options };
