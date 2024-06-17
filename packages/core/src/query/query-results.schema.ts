import * as z from "zod";

import { QueryResults } from "./query-results";

/**
 * Creates a {@link QueryResults query results} validation schema for a schema.
 * Mostly useful for casting as it the validation itself should not be necessary.
 *
 * Use `Schemas.objectForJson` when it passes through HTTP.
 *
 * @param schema the object schema to create this {@link QueryResults query results} schema
 * @returns the {@link QueryResults query results} validation schema for the given schema
 */
export function createQueryResultsSchema<T extends z.ZodTypeAny>(schema: T) {
	return z.object({
		data: z.array(schema),
		pagination: z.object({
			range: z.object({
				end: z.number(),
				start: z.number(),
			}),
			total: z.number(),
		}),
	}) satisfies z.ZodType<QueryResults<z.infer<T>>>;
}
