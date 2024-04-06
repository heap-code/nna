import * as z from "zod";

import { ZodNestedType } from "./types";

/** Mostly any known Zod type */
export type ZodAnyFirstPartySchemaType =
	| z.ZodFirstPartySchemaTypes
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to use logic as the library one
	| z.ZodReadonly<any>;

/** Typename definition from {@link ZodAnyFirstPartySchemaType} */
export type ZodAnyFirstPartySchemaTypeName =
	ZodAnyFirstPartySchemaType["_def"]["typeName"];

/**
 * Determines if the given schema if of type or given nested type
 *
 * @param schema to test
 * @param types that the schema should be directly or on a nested level
 * @returns if the schema satisfy one the given types
 */
export function isZodSchemaFirstPartyNestedType<
	const T extends ZodAnyFirstPartySchemaTypeName,
>(
	schema: ZodAnyFirstPartySchemaType,
	types: readonly T[],
): schema is ZodNestedType<
	Extract<ZodAnyFirstPartySchemaType, { _def: { typeName: T } }>
> {
	const definition = schema._def;

	switch (definition.typeName) {
		case z.ZodFirstPartyTypeKind.ZodNullable:
		case z.ZodFirstPartyTypeKind.ZodOptional:
		case z.ZodFirstPartyTypeKind.ZodReadonly:
			return isZodSchemaFirstPartyNestedType(
				definition.innerType as ZodAnyFirstPartySchemaType,
				types,
			);

		default:
			return types.includes(definition.typeName as never);
	}
}
