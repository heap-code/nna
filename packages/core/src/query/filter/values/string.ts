import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter";

/** Operators filter for `string` */
export type Operators = FilterValueOperatorMap<string>;
/** Filter for `string` */
export type Type = FilterValue<string>;

/** @internal */
const type = z.string();

/** The validation schema for `string` operators only */
export const schemaOperators = createFilterOperatorSchema(type);

/** Validation schema for `string` filter */
export const schema: z.ZodType<Type> = type.or(schemaOperators);
/** Strict validation schema for `string` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = type.or(schemaOperators.strict());
