import { z } from "zod";

import { FilterValueOperatorMap } from "../filter";

/**
 * TODO
 *
 * @param baseType
 * @param bType0
 */
export function createFilterOperatorSchema<
	T extends z.ZodType,
	U extends z.ZodType = T,
>(baseType: T, bType0?: U) {
	const bType = bType0 ?? baseType;

	return z.object({
		$eq: bType.optional(),
		$ne: bType.optional(),

		$gt: baseType.optional(),
		$gte: baseType.optional(),
		$lt: baseType.optional(),
		$lte: baseType.optional(),

		$in: z.array(bType).optional(),
		$nin: z.array(bType).optional(),

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
