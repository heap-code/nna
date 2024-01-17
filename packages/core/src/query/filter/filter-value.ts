import type { OperatorMap } from "@mikro-orm/core/typings";

import { QueryPrimitive } from "../query.types";

/** Filter operators for "Primitive" (+ Date) values */
export type FilterValueOperatorMap<T> = Omit<
	OperatorMap<T>,
	| "$and"
	| "$contained"
	| "$contains"
	| "$every"
	| "$ilike"
	| "$none"
	| "$not"
	| "$or"
	| "$overlap"
	| "$some"
>;

/** Filter for "Primitive" (+ Date) values */
export type FilterValue<T extends QueryPrimitive> =
	| FilterValueOperatorMap<T>
	| T;
