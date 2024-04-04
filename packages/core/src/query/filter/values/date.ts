import * as z from "zod";

import * as common from "./common";
import { FilterValue } from "../filter-value";

/** Filter for `date` */
export type DateFilter = FilterValue<Date>;
/** Filter for nullable `date` */
export type DateFilterNullable = FilterValue<Date | null>;

/** Options to create a `date` filter validation schema */
export type DateOptions = common.SchemaOptions;

/**
 * Creates a validation schema for a `date` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(
	options: common.SchemaOptionsNullable & DateOptions,
): z.ZodType<DateFilterNullable>;
/**
 * Creates a validation schema for a nullable `date` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options?: DateOptions): z.ZodType<DateFilter>;

/**
 * Creates a validation schema for a `date` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options: DateOptions = {}) {
	const { coerce } = options;
	return common.schema(coerce ? z.coerce.date() : z.date(), options);
}

export { schema as date };
