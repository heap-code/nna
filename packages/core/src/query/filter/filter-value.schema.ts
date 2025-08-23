import * as z from "zod";

import { FilterValue } from "./filter-value";
import * as FilterValues from "./values";
import type { FilterZodEqType, SchemaOptions } from "./values/common";

/** Options to create a `Value` (`QueryPrimitive`) filter validation schema */
export type ValueOptions = Omit<SchemaOptions, "nullable">;

/**
 * Creates a validation schema from a comparable schema.
 * Example: for a `string` schema, it returns a validations schema for {@link FilterValue}<string>
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
	): z.ZodType<FilterValue<NonNullable<z.infer<T>>>> => {
		const { def } = zodType;
		switch (def.type) {
			case "nullable":
				return fn(def.innerType, true);
			case "optional":
			case "readonly":
				return fn(def.innerType, nullable);

			case "boolean":
				// @ts-expect-error -- FIXME ZOD-V4_UP
				return FilterValues.boolean({ ...options, nullable });
			case "date":
				// @ts-expect-error -- FIXME ZOD-V4_UP
				return FilterValues.date({ ...options, nullable });
			case "number":
				// @ts-expect-error -- FIXME ZOD-V4_UP
				return FilterValues.number({ ...options, nullable });
			case "string":
				// @ts-expect-error -- FIXME ZOD-V4_UP
				return FilterValues.string({ ...options, nullable });

			case "enum":
				return FilterValues.enum(zodType as never, {
					...options,
					nullable,
				});
		}
	};

	return fn(schema, false);
}

export { schema as value };
