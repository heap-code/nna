import * as z from "zod";

import * as common from "./common";
import { FilterValue } from "../filter-value";

/** Zod enum schemas managed as a filterable value */
export type EnumSchema = z.ZodEnum;
/** Options to create a `enum` filter validation schema */
export type EnumOptions = common.SchemaOptions;

/**
 * Creates a validation schema for an `enum` filter
 *
 * @param enumSchema the (original) enum schema to create this filter schema from
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema<T extends z.ZodEnum>(
	enumSchema: T,
	options: common.SchemaOptionsNullable & EnumOptions,
): z.ZodType<FilterValue<z.infer<T> | null>>;
/**
 * Creates a validation schema for a nullable `enum` filter
 *
 * @param enumSchema the (original) enum schema to create this filter schema from
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema<T extends z.ZodEnum>(
	enumSchema: T,
	options?: EnumOptions,
): z.ZodType<FilterValue<z.infer<T>>>;

/**
 * Creates a validation schema for an `enum` filter
 *
 * @param enumSchema the (original) enum schema to create this filter schema from
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema<T extends z.ZodEnum>(enumSchema: T, options: EnumOptions = {}) {
	if (options.coerce && enumSchema.def.type === "enum") {
		const values = Object.values(enumSchema.def.entries);
		const schema = z
			.custom()
			.transform(
				inp =>
					values.find(
						value => value.toString() === inp?.toString(),
					) ?? inp,
			)
			.pipe(enumSchema) as unknown as T;

		return common.schema(schema, options);
	}

	return common.schema(enumSchema, options);
}

export { schema as enum };
