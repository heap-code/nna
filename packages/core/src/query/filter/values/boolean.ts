import * as z from "zod";

import * as common from "./common";
import { FilterValue } from "../filter-value";

/** Filter for `boolean` */
export type BooleanFilter = FilterValue<boolean>;
/** Filter for nullable `boolean` */
export type BooleanFilterNullable = FilterValue<boolean | null>;

/** Options to create a `boolean` filter validation schema */
export type BooleanOptions = common.SchemaOptions;

/**
 * Creates a validation schema for a `boolean` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(
	options: BooleanOptions & common.SchemaOptionsNullable,
): z.ZodType<BooleanFilterNullable>;
/**
 * Creates a validation schema for a nullable `boolean` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options?: BooleanOptions): z.ZodType<BooleanFilter>;

/**
 * Creates a validation schema for a `boolean` filter
 *
 * @param options for the creation of the schema
 * @returns the validation schema
 */
function schema(options: BooleanOptions = {}) {
	const { coerce } = options;
	return common.schema(
		coerce
			? (z
					.custom()
					.transform(val =>
						val === "true" ? true : val === "false" ? false : val,
					)
					.pipe(z.boolean()) as never)
			: z.boolean(),
		options,
	);
}

export { schema as boolean };
