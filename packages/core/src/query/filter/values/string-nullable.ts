import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter";

/** Operators filter for nullable `string` */
export type Operators = FilterValueOperatorMap<string | null>;
/** Filter for nullable `string` */
export type Type = FilterValue<string | null>;

/** @internal */
const type = z.string().nullable();

/** The validation schema for nullable `string` operators only */
export const schemaOperators = createFilterOperatorSchema(z.string(), type);

/** Validation schema for nullable `string` filter */
export const schema: z.ZodType<Type> = type.or(schemaOperators);
/** Strict validation schema for nullable `string` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = type.or(schemaOperators.strict());
