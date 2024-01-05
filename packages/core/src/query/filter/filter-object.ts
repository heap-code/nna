import { FilterValue } from "./filter-value";
import { QueryPrimitive } from "../query.primitive";

/** Filter for objects */
export type FilterObject<T> = {
	[P in keyof T]?: T[P] extends QueryPrimitive
		? FilterValue<T[P]>
		: T[P] extends ReadonlyArray<infer U>
			? FilterObject<U>
			: FilterObject<T[P]>;
};
