import * as z from "zod";

import type { FilterZodEqType } from "./values/common";

/**
 * Determines if a schema can be used to created its {@link FilterValue} validation schema
 *
 * @param schema to determine
 * @returns if the given schema can be converted to `FilterValue` schema
 */
export function isFilterValueConvertible(
	schema: z.ZodTypeAny,
): schema is FilterZodEqType {
	const definition = schema._def as FilterZodEqType["_def"] | z.ZodUnknownDef;

	switch (definition.typeName) {
		case z.ZodFirstPartyTypeKind.ZodNullable:
			return isFilterValueConvertible(definition.innerType);

		case z.ZodFirstPartyTypeKind.ZodBoolean:
		case z.ZodFirstPartyTypeKind.ZodDate:
		case z.ZodFirstPartyTypeKind.ZodNumber:
		case z.ZodFirstPartyTypeKind.ZodString:
			return true;

		case z.ZodFirstPartyTypeKind.ZodEnum:
		case z.ZodFirstPartyTypeKind.ZodNativeEnum:
			return true;
	}

	return false;
}
