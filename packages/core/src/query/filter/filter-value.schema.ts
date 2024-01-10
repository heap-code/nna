import { z } from "zod";

import { FilterValue } from "./filter-value";
import * as FilterValues from "./values";
import type { FilterZodEqType, SchemaOptions } from "./values/common";

/** Options to create a `Value` (`QueryPrimitive`) filter validation schema */
export type ValueOptions = Omit<SchemaOptions, "nullable">;

/**
 * Creates a validation schema from a comparable schema.
 * Exemple: for a `string` schema, it returns a validations schema for {@link FilterValue}<string>
 *
 * @param schema the (original) schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function schema<T extends FilterZodEqType>(
	schema: T,
	options: ValueOptions = {},
) {
	const fn = (
		zodType: FilterZodEqType,
		nullable: boolean,
	): z.ZodType<FilterValue<z.infer<T>>> => {
		switch (zodType._def.typeName) {
			case z.ZodFirstPartyTypeKind.ZodNullable:
				return fn(zodType._def.innerType, true);

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
				return FilterValues.enum(zodType as FilterValues.EnumSchema, {
					...options,
					nullable,
				});
		}
	};

	return fn(schema, false);
}

export { schema as value };
