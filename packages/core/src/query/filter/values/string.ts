import * as z from "zod";

import * as common from "./common";
import { FilterValue } from "../filter-value";

/** Filter for `string` */
export type StringFilter = FilterValue<string>;
/** Filter for nullable `string` */
export type StringFilterNullable = FilterValue<string | null>;

/** Options to create a `string` filter validation schema */
export type StringOptions = common.SchemaOptions;

/**
 * Creates a validation schema for a `string` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(
	options: common.SchemaOptionsNullable & StringOptions,
): z.ZodType<StringFilterNullable>;
/**
 * Creates a validation schema for a nullable `string` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options?: StringOptions): z.ZodType<StringFilter>;

/**
 * Creates a validation schema for a `string` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options: StringOptions = {}) {
	const { coerce } = options;
	return common.schema(coerce ? z.coerce.string() : z.string(), options);
}

export { schema as string };
