import { FilterValue } from "./filter-value";
import { PrimitiveExtended } from "../../primitive";

/** Filter for objects */
export type FilterObject<T> = {
	[P in keyof T]?: T[P] extends PrimitiveExtended
		? FilterValue<T[P]>
		: T[P] extends ReadonlyArray<infer U>
			? FilterObject<U>
			: T[P] extends object
				? FilterObject<T[P]>
				: FilterValue<T[P]>;
};
