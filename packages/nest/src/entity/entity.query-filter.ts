import { ExpandProperty } from "@mikro-orm/core";
import { QueryFilter } from "@nna/core";

/** "Transform" a `mikro-orm` entity to a "query-able" model */
export type EntityQueryModel<T> = {
	[K in keyof T]: ExpandProperty<T[K]> extends object
		? EntityQueryModel<ExpandProperty<T[K]>>
		: T[K];
};

/**
 * Filter type to use with a `mikro-orm` entity.
 * It makes it compatible with {@link QueryFilter}
 */
export type EntityQueryFilter<T> = QueryFilter<EntityQueryModel<T>>;
