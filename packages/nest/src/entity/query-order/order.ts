import { EntityKey } from "@mikro-orm/core";
import { QueryOrder, QueryPrimitive } from "@nna/core";

import { OrderValue, fromQueryOrderValue } from "./order-value";

/** Object type representing an ordering query for an entity. */
export type Order<T extends object> = {
	[K in EntityKey<T>]?: T[K] extends QueryPrimitive
		? OrderValue
		: Order<NonNullable<T[K] extends Array<infer U> ? U : T[K]>>;
};

/**
 * Converts an {@link QueryOrder} to a {@link QueryOrderMap} that can be used with Mikro-orm
 *
 * @param order The query order to convert
 * @returns a Mikro-orm query object
 */
export function fromQueryOrder<T extends object>(
	order: QueryOrder<T>,
): Order<T> {
	return Object.fromEntries(
		Object.entries(order).map(([key, value]) => [
			key,
			typeof value === "string"
				? // TODO: manager error ? Or consider it typesafe ?
					fromQueryOrderValue(value as never)
				: fromQueryOrder(value as never),
		]),
	) as never;
}
