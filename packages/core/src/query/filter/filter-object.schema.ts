import { z } from "zod";

import { FilterObject } from "./filter-object";

export interface CreateFilterObjectSchemaOptions {
	// TODO
	strict?: boolean;
}

/**
 * TODO
 *
 * @param schema
 * @param options
 */
export function createFilterObjectSchema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: CreateFilterObjectSchemaOptions,
): z.ZodType<FilterObject<z.infer<T>>> {
	return z.object({});
}
