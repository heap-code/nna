import { z } from "zod";

import * as Values from "./values";
import type { FilterZodEqType } from "./values/common";

export type FilterValueType =
	| Values.Boolean.Type
	| Values.BooleanNullable.Type
	| Values.Date.Type
	| Values.DateNullable.Type
	| Values.Number.Type
	| Values.NumberNullable.Type
	| Values.String.Type
	| Values.StringNullable.Type;

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

/**
 *
 * @param abc
 */
export function getFilterValueFromZodEqType(abc: FilterZodEqType) {
	const fn = (
		{ _def: def }: FilterZodEqType,
		nullable: boolean,
	): z.ZodType<FilterValueType> => {
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
