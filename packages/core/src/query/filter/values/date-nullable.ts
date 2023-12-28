import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter";

/** Operators filter for `Date` */
export type Operators = FilterValueOperatorMap<Date | null>;
/** Filter for `Date` */
export type Type = FilterValue<Date | null>;

/** @internal */
const type = z.date().nullable();

/** The validation schema for `Date` operators only */
export const schemaOperators = createFilterOperatorSchema(z.date(), type);

/** Validation schema for `Date` filter */
export const schema: z.ZodType<Type> = schemaOperators.or(type);
/** Strict validation schema for `Date` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = schemaOperators.strict().or(type);
