import type { OperatorMap } from "@mikro-orm/core/typings";

import { QueryPrimitive } from "../query.types";

/** Filter operators for "Primitive" (+ Date) values */
export type FilterValueOperatorMap<T> = Pick<
	OperatorMap<T>,
	| "$eq"
	| "$exists"
	| "$gt"
	| "$gte"
	| "$in"
	| "$like"
	| "$lt"
	| "$lte"
	| "$ne"
	| "$nin"
	| "$re"
>;

/** Filter for "Primitive" (+ Date) values */
export type FilterValue<T extends QueryPrimitive> =
	| FilterValueOperatorMap<T>
	| T;
