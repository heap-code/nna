import type { OperatorMap } from "@mikro-orm/core/typings";

/** Filter operators for "Primitive" (+ Date) values */
export type FilterValueOperatorMap<T> = Omit<
	OperatorMap<T>,
	"$and" | "$contained" | "$contains" | "$ilike" | "$not" | "$or" | "$overlap"
>;

/** Filter for "Primitive" (+ Date) values */
export type FilterValue<T> = FilterValueOperatorMap<T> | T;
