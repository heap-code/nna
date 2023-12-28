import { z } from "zod";

import { Filter } from "./filter";

export interface CreateFilterSchemaOptions {
	// TODO
	strict?: boolean;
}

/**
 * TODO
 *
 * @param schema
 * @param options
 */
export function createFilterSchema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options: CreateFilterSchemaOptions,
): z.ZodType<Filter<z.infer<T>>> {
	// TODO

	return z.object({});
}
