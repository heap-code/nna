import * as z from "zod";

import type { FilterZodEqType } from "./values/common";
import { isSchemaFirstPartyNestedType } from "../../schema";

/** @internal */
const TYPES = [
	"boolean",
	"date",
	"number",
	"string",
	"enum",
] as const satisfies Array<z.ZodType["def"]["type"]>;

/**
 * Determines if a schema can be used to created its {@link FilterValue} validation schema
 *
 * @param schema to determine
 * @returns if the given schema can be converted to `FilterValue` schema
 */
export function isFilterValueConvertible(
	schema: z.ZodType,
): schema is FilterZodEqType {
	return isSchemaFirstPartyNestedType(schema, TYPES);
}
