import { z } from "zod";

import { createFilterOperatorSchema } from "./common";
import { FilterValue, FilterValueOperatorMap } from "../filter";

/** Operators filter for nullable `boolean` */
export type Operators = FilterValueOperatorMap<boolean | null>;
/** Filter for nullable `boolean` */
export type Type = FilterValue<boolean | null>;

/** @internal */
const type = z.boolean().nullable();

/** The validation schema for nullable `boolean` operators only */
export const schemaOperators = createFilterOperatorSchema(z.boolean(), type);

/** Validation schema for nullable `boolean` filter */
export const schema: z.ZodType<Type> = schemaOperators.or(type);
/** Strict validation schema for nullable `boolean` filter (no extraenous values) */
export const schemaStrict: z.ZodType<Type> = schemaOperators.strict().or(type);
