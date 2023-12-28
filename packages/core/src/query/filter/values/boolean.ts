import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter";

/** Operators filter for `boolean` */
export type Operators = FilterValueOperatorMap<boolean>;
/** Filter for `boolean` */
export type Type = FilterValue<boolean>;

/** @internal */
const type = z.boolean();

/** The validation schema for `boolean` operators only */
export const schemaOperators = createFilterOperatorSchema(type);

/** Validation schema for `boolean` filter */
export const schema: z.ZodType<Type> = schemaOperators.or(type);
/** Strict validation schema for `boolean` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = schemaOperators.strict().or(type);
