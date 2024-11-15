import { Collection, EntityDTO, EntityRef } from "@mikro-orm/core";
import { QueryFilter, QueryPrimitive } from "@nna/core";

/** "Transform" a `mikro-orm` entity to a "query-able" model */
export type EntityQueryModel<T> = {
	[K in keyof T]: T[K] extends Collection<infer U>
		? EntityQueryModel<U>
		: T[K] extends EntityRef<infer U>
			? EntityQueryModel<U>
			: T[K] extends QueryPrimitive
				? T[K]
				: EntityQueryModel<T[K]>;
};

/**
 * Filter type to use with a `mikro-orm` entity.
 * It makes it compatible with {@link QueryFilter}
 */
export type EntityQueryFilter<T> = QueryFilter<EntityDTO<EntityQueryModel<T>>>;
