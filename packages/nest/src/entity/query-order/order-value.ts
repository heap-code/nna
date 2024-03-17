import { QueryOrder } from "@mikro-orm/core";
import { QueryOrderValue } from "@nna/core";

/**
 * Order Values (subset of Mikro-orm ones)
 */
export type OrderValue =
	| QueryOrder.ASC
	| QueryOrder.ASC_NULLS_FIRST
	| QueryOrder.ASC_NULLS_LAST
	| QueryOrder.DESC
	| QueryOrder.DESC_NULLS_FIRST
	| QueryOrder.DESC_NULLS_LAST;

/**
 * Converts a {@link QueryOrderValue} to a value usable by Mikro-orm
 *
 * @param value to convert
 * @returns the converted value
 */
export function fromQueryOrderValue(value: QueryOrderValue): OrderValue {
	switch (value) {
		case "asc":
			return QueryOrder.ASC;
		case "asc_nf":
			return QueryOrder.ASC_NULLS_FIRST;
		case "asc_nl":
			return QueryOrder.ASC_NULLS_LAST;

		case "desc":
			return QueryOrder.DESC;
		case "desc_nf":
			return QueryOrder.DESC_NULLS_FIRST;
		case "desc_nl":
			return QueryOrder.DESC_NULLS_LAST;
	}
}
