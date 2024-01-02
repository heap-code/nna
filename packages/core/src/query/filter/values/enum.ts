import { z } from "zod";

import { FilterValue } from "../filter-value";

export interface SchemaOptions {
	// coerce?: boolean;
	nullable?: boolean;
	strict?: boolean;
}

export type SchemaEnum = z.ZodEnum<any> | z.ZodNativeEnum<any>;

export function schema<T extends SchemaEnum>(
	enumSchema: T,
	options?: SchemaOptions & { nullable?: false },
): z.ZodType<FilterValue<z.infer<T>>>;
export function schema<T extends SchemaEnum>(
	enumSchema: T,
	options: SchemaOptions & { nullable: true },
): z.ZodType<FilterValue<z.infer<T> | null>>;

/**
 *
 * @param enumSchema
 * @param options
 */
export function schema<T extends SchemaEnum>(
	enumSchema: T,
	options?: SchemaOptions,
):
	| z.ZodType<FilterValue<z.infer<T> | null>>
	| z.ZodType<FilterValue<z.infer<T>>> {
	throw new Error("");
}
