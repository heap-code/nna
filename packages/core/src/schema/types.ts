import type * as z from "zod";

/** Nested zod types (at least managed) */
export type _NestedType<T extends z.ZodType> =
	| z.ZodNullable<T>
	| z.ZodOptional<T>
	| z.ZodReadonly<T>;
/** Zod Type that are nested due to constraint such as `nullable` */
export type NestedType<T extends z.ZodType> = _NestedType<T> | T;
