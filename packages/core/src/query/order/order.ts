import { OrderValue } from "./order-value";
import { QueryPrimitive } from "../query.types";

/** Object type representing an ordering query. */
export type Order<T> = {
	[K in keyof T]?: T[K] extends QueryPrimitive
		? OrderValue
		: T[K] extends ReadonlyArray<infer U>
			? Order<U>
			: Order<T[K]>;
};
