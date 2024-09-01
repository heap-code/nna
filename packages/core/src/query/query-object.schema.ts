import * as z from "zod";

import type { QueryObject, QueryObjectSchema } from ".";
import * as QueryFilter from "./filter";
import * as QueryOption from "./options";

/** Options to create a query order validation schema */
export type QueryObjectOptions = QueryOption.QueryOptionsOptions;

/**
 * Creates a {@link QueryObject query object} validation schema for an object schema.
 *
 * @param schema the object schema to create this {@link QueryObject query object} schema
 * @param options for the creation of the schema
 * @returns the {@link QueryObject query object} validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: QueryObjectOptions,
) {
	if (!options) {
		return _schema(schema, {});
	}

	type QryObject = QueryObject<z.infer<T>>;
	type QryObjShape = Record<keyof Pick<QryObject, "filter">, z.ZodType>;

	return QueryOption.options(schema, options).extend({
		filter: QueryFilter.filter(schema, options).optional(),
	} satisfies QryObjShape) satisfies z.ZodType<QryObject>;
}

export { _schema as createQueryObjectSchema };
