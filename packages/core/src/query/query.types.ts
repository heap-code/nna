import * as z from "zod";

/**
 * Primitives for FilterValue
 *
 * `Date` is considered as a primitive for query
 */
export type QueryPrimitive = Date | boolean | number | string | null;

/** Zod Object schemas managed by this `Query` "package" */
export type QueryObjectSchema =
	| z.ZodDiscriminatedUnion<string, Array<z.ZodObject<z.ZodRawShape>>>
	| z.ZodObject<z.ZodRawShape>;
