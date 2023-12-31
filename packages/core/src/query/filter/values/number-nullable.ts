import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter-value";

/** Operators filter for nullable `number` */
export type Operators = FilterValueOperatorMap<number | null>;
/** Filter for nullable `number` */
export type Type = FilterValue<number | null>;

/** @internal */
const type = z.number().nullable();

/** The validation schema for nullable `number` operators only */
export const schemaOperators = createFilterOperatorSchema(
	z.number(),
	type,
) satisfies z.ZodType<Operators>;

/** Validation schema for nullable `number` filter */
export const schema: z.ZodType<Type> = schemaOperators.or(type);
/** Strict validation schema for nullable `number` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = schemaOperators.strict().or(type);
