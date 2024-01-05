import { z } from "zod";

import { FilterValue } from "./filter-value";
import * as FilterValues from "./values";
import type { FilterZodEqType, SchemaOptions } from "./values/common";

/**
 * Determines if a schema can be used to created its {@link FilterValue} validation schema
 *
 * @param schema to determine
 * @returns if the given schema can be converted to `FilterValue` schema
 */
export function isFilterValueConvertible(
	schema: z.ZodTypeAny,
): schema is FilterZodEqType {
	const definition = schema._def as FilterZodEqType["_def"] | undefined;

	switch (definition?.typeName) {
		case z.ZodFirstPartyTypeKind.ZodBoolean:
		case z.ZodFirstPartyTypeKind.ZodDate:
		case z.ZodFirstPartyTypeKind.ZodNumber:
		case z.ZodFirstPartyTypeKind.ZodString:

		case z.ZodFirstPartyTypeKind.ZodEnum:
		case z.ZodFirstPartyTypeKind.ZodNativeEnum:
			return true;
		case z.ZodFirstPartyTypeKind.ZodNullable:
			return isFilterValueConvertible(definition.innerType);
	}

	return false;
}

export type ValueOptions = Omit<SchemaOptions, "nullable">;

/**
 * Creates a validation schema from a comparable schema.
 * Exemple: for a `string` schema, it returns a validations schema for {@link FilterValue}<string>
 *
 * @param schema
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function schema<T extends FilterZodEqType>(
	schema: T,
	options: ValueOptions = {},
) {
	// TODO (FilterValue-singleton): a singleton for each primitive (expect enum) with theirs options for performance?

	const fn = (
		schema: T,
		nullable: boolean,
	): z.ZodType<FilterValue<z.infer<T>>> => {
		switch (schema._def.typeName) {
			case z.ZodFirstPartyTypeKind.ZodNullable:
				return fn(schema._def.innerType, true);

			case z.ZodFirstPartyTypeKind.ZodBoolean:
				return FilterValues.boolean({ ...options, nullable });
			case z.ZodFirstPartyTypeKind.ZodDate:
				return FilterValues.date({ ...options, nullable });
			case z.ZodFirstPartyTypeKind.ZodNumber:
				return FilterValues.number({ ...options, nullable });
			case z.ZodFirstPartyTypeKind.ZodString:
				return FilterValues.string({ ...options, nullable });

			case z.ZodFirstPartyTypeKind.ZodEnum:
			case z.ZodFirstPartyTypeKind.ZodNativeEnum:
				return FilterValues.enum(schema, { ...options, nullable });
		}
	};

	return fn(schema, false);
}

export { schema as value };
