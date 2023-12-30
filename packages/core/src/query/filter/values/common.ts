import { z } from "zod";

import { FilterValueOperatorMap } from "../filter-value";

/**
 * Creates a validation schema for a value query filter
 *
 * @param ordType type that can be ordered (>, >=, <, <=)
 * @param eqType type that can be compared (==, !=)
 * @returns the validation schema
 */
export function createFilterOperatorSchema<
	T extends z.ZodType,
	U extends z.ZodType = T,
>(ordType: T, eqType?: U) {
	if (!eqType) {
		return createFilterOperatorSchema(ordType, ordType);
	}

	return z
		.object({
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
		} satisfies Record<keyof FilterValueOperatorMap<unknown>, z.ZodType>)
		.partial();
}
