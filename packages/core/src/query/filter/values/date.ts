import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter-value";

/** Operators filter for `Date` */
export type Operators = FilterValueOperatorMap<Date>;
/** Filter for `Date` */
export type Type = FilterValue<Date>;

/** @internal */
const type = z.date();

/** The validation schema for `Date` operators only */
export const schemaOperators = createFilterOperatorSchema(
	type,
) satisfies z.ZodType<Operators>;

/** Validation schema for `Date` filter */
export const schema: z.ZodType<Type> = schemaOperators.or(type);
/** Strict validation schema for `Date` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = schemaOperators.strict().or(type);
