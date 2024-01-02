import { z } from "zod";

import type { FilterValueOperatorMap } from "../filter-value";

/** Zod schema for FilterValue ordernable type */
export type FilterZodOrdType =
	| z.ZodBoolean
	| z.ZodDate
	| z.ZodNumber
	| z.ZodString;
/** Zod schema for FilterValue comparable type */
export type FilterZodEqType = FilterZodOrdType | z.ZodNullable<FilterZodEqType>;

/**
 * Creates a validation schema for a value query filter
 *
 * @param ordType type that can be ordered (>, >=, <, <=)
 * @param eqType type that can be compared (==, !=)
 * @returns the validation schema
 */
export function createFilterOperatorSchema<
	T extends FilterZodOrdType,
	U extends FilterZodEqType = T,
>(ordType: T, eqType?: U) {
	if (!eqType) {
		return createFilterOperatorSchema(ordType, ordType);
	}

	// FIXME: The output type is wrongly determined if the `satisfies` is put directly on the object
	const schema = {
		$eq: eqType,
		$ne: eqType,

		$gt: ordType,
		$gte: ordType,
		$lt: ordType,
		$lte: ordType,

		$in: z.array(eqType),
		$nin: z.array(eqType),

		$exists: z.boolean(),

		/**
		 * Search for records whose value match the given text.
		 *
		 * It works correctly only to indexed properties.
		 */
		$fulltext: z.string(),
		$like: z.string(),
		$re: z.string(),
	};

	return z
		.object(
			schema satisfies Record<
				keyof FilterValueOperatorMap<unknown>,
				z.ZodType
			>,
		)
		.partial();
}
