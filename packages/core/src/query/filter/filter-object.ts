import { FilterValue } from "./filter-value";
import { QueryPrimitive } from "../query.types";

/** Filter for objects */
export type FilterObject<T> = {
	[K in keyof T]?: T[K] extends QueryPrimitive
		? FilterValue<T[K]>
		: T[K] extends ReadonlyArray<infer U>
			? FilterObject<U>
			: FilterObject<T[K]>;
};
