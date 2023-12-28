import { z } from "zod";

import { FilterValueOperatorMap } from "../filter";

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

	return z.object({
		$eq: eqType.optional(),
		$ne: eqType.optional(),

		$gt: ordType.optional(),
		$gte: ordType.optional(),
		$lt: ordType.optional(),
		$lte: ordType.optional(),

		$in: z.array(eqType).optional(),
		$nin: z.array(eqType).optional(),

		$exists: z.boolean().optional(),

		/**
		 * Search for records whose value match the given text.
		 *
		 * It works correctly only to indexed properties.
		 */
		$fulltext: z.string().optional(),
		$like: z.string().optional(),
		$re: z.string().optional(),
	} satisfies Record<keyof FilterValueOperatorMap<unknown>, z.ZodType>);
}
