import { EntityDTO, EntityRef } from "@mikro-orm/core";
import { QueryFilter } from "@nna/core";

/** "Transform" a `mikro-orm` entity to a "query-able" model */
export type EntityQueryModel<T> = {
	[K in keyof T]: T[K] extends EntityRef<infer U>
		? EntityQueryModel<U>
		: T[K];
};

/**
 * Filter type to use with a `mikro-orm` entity.
 * It makes it compatible with {@link QueryFilter}
 */
export type EntityQueryFilter<T> = QueryFilter<EntityDTO<EntityQueryModel<T>>>;
