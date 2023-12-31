import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter-value";

/** Operators filter for `number` */
export type Operators = FilterValueOperatorMap<number>;
/** Filter for `number` */
export type Type = FilterValue<number>;

/** @internal */
const type = z.number();

/** The validation schema for `number` operators only */
export const schemaOperators = createFilterOperatorSchema(
	type,
) satisfies z.ZodType<Operators>;

/** Validation schema for `number` filter */
export const schema: z.ZodType<Type> = schemaOperators.or(type);
/** Strict validation schema for `number` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = schemaOperators.strict().or(type);
