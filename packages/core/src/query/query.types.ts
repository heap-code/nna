import * as z from "zod";

/**
 * Primitives for FilterValue
 *
 * `Date` is considered as a primitive for query
 */
export type QueryPrimitive = Date | boolean | number | string | null;

/** Zod Object schemas managed by this `Query` "package" */
export type QueryObjectSchema =
	| z.ZodDiscriminatedUnion
	| z.ZodObject<z.ZodRawShape>;
