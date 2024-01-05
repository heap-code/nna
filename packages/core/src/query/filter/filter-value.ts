import type { OperatorMap } from "@mikro-orm/core/typings";

import { PrimitiveExtended } from "../../primitive";

/** Filter operators for "Primitive" (+ Date) values */
export type FilterValueOperatorMap<T> = Omit<
	OperatorMap<T>,
	"$and" | "$contained" | "$contains" | "$ilike" | "$not" | "$or" | "$overlap"
>;

/** Filter for "Primitive" (+ Date) values */
export type FilterValue<T extends PrimitiveExtended> =
	| FilterValueOperatorMap<T>
	| T;
