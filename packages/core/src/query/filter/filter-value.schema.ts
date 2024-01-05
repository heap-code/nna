import { z } from "zod";

import * as Values from "./values";
import type { FilterZodEqType } from "./values/common";

export type FilterValueType =
	| Values.BooleanFilter
	| Values.BooleanFilterNullable
	| Values.DateFilter
	| Values.DateFilterNullable
	| Values.NumberFilter
	| Values.NumberFilterNullable
	| Values.StringFilter
	| Values.StringFilterNullable;

/**
 *
 * @param schema
 */
export function isZodSchemaFilterEqType(
	schema: z.ZodTypeAny,
): schema is FilterZodEqType {
	const definition = schema._def as FilterZodEqType["_def"] | undefined;

	switch (definition?.typeName) {
		case z.ZodFirstPartyTypeKind.ZodString:
		case z.ZodFirstPartyTypeKind.ZodNumber:
		case z.ZodFirstPartyTypeKind.ZodBoolean:
		case z.ZodFirstPartyTypeKind.ZodDate:
			return true;
		case z.ZodFirstPartyTypeKind.ZodNullable:
			return isZodSchemaFilterEqType(definition.innerType);
	}

	return false;
}

export interface ValueOptions {}

/**
 *
 * @param abc
 */
function schema(abc: FilterZodEqType) {
	const fn = (
		{ _def: def }: FilterZodEqType,
		nullable: boolean,
	): z.ZodType<FilterValueType> => {
		// TODO (FilterValue-singleton): a singleton for each primitive (expect enum) with theirs options for performance?
		switch (def.typeName) {
			case z.ZodFirstPartyTypeKind.ZodBoolean:
				return Values.boolean({ nullable });
			case z.ZodFirstPartyTypeKind.ZodDate:
				return Values.date({ nullable });
			case z.ZodFirstPartyTypeKind.ZodNumber:
				return Values.number({ nullable });
			case z.ZodFirstPartyTypeKind.ZodString:
				return Values.string({ nullable });

			case z.ZodFirstPartyTypeKind.ZodNullable:
				return fn(def.innerType, true);
		}
	};

	return fn(abc, false);
}

export { schema as value };
