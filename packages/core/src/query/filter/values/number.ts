import { z } from "zod";

import * as common from "./common";
import { FilterValue } from "../filter-value";

/** Filter for `number` */
export type NumberFilter = FilterValue<number>;
/** Filter for nullable `number` */
export type NumberFilterNullable = FilterValue<number | null>;

/** Options to create a `number` filter validation schema */
export type NumberOptions = common.SchemaOptions;

/**
 * Creates a validation schema for a `number` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(
	options: common.SchemaOptionsNullable & NumberOptions,
): z.ZodType<NumberFilterNullable>;
/**
 * Creates a validation schema for a nullable `number` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options?: NumberOptions): z.ZodType<NumberFilter>;

/**
 * Creates a validation schema for a `number` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options: NumberOptions = {}) {
	const { coerce } = options;
	return common.schema(coerce ? z.coerce.number() : z.number(), options);
}

export { schema as number };
