import * as z from "zod";

import type { FilterZodEqType } from "./values/common";
import { isSchemaFirstPartyNestedType } from "../../schema";

/** @internal */
const TYPES = [
	z.ZodFirstPartyTypeKind.ZodBoolean,
	z.ZodFirstPartyTypeKind.ZodDate,
	z.ZodFirstPartyTypeKind.ZodNumber,
	z.ZodFirstPartyTypeKind.ZodString,
	z.ZodFirstPartyTypeKind.ZodEnum,
	z.ZodFirstPartyTypeKind.ZodNativeEnum,
] as const;

/**
 * Determines if a schema can be used to created its {@link FilterValue} validation schema
 *
 * @param schema to determine
 * @returns if the given schema can be converted to `FilterValue` schema
 */
export function isFilterValueConvertible(
	schema: z.ZodTypeAny,
): schema is FilterZodEqType {
	return isSchemaFirstPartyNestedType(schema, TYPES);
}
