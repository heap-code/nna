import type * as z from "zod";

/** Zod Type that are nested due to constraint such as `nullable` */
export type NestedType<T extends z.ZodTypeAny> =
	| T
	| z.ZodNullable<T>
	| z.ZodOptional<T>
	| z.ZodReadonly<T>;
