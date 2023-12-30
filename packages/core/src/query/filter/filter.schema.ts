import { z } from "zod";

import { Filter } from "./filter";
import { CreateFilterObjectSchemaOptions } from "./filter-object.schema";

export interface CreateFilterSchemaOptions
	extends CreateFilterObjectSchemaOptions {}

/**
 * TODO
 *
 * @param schema
 * @param options
 */
export function createFilterSchema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: CreateFilterSchemaOptions,
): z.ZodType<Filter<z.infer<T>>> {
	// TODO

	return z.object({});
}
