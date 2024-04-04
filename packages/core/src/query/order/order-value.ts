/** The possible values for an ascendant ordering */
export const ORDER_VALUES_ASC = ["asc_nf", "asc_nl", "asc"] as const;
/** The possible values for a descendant ordering */
export const ORDER_VALUES_DESC = ["desc_nf", "desc_nl", "desc"] as const;
/** The possible values for an ordering */
export const ORDER_VALUES = [
	...ORDER_VALUES_ASC,
	...ORDER_VALUES_DESC,
] as const;

/** Ascendant values from {@link OrderValue}  */
export type OrderValueAsc = (typeof ORDER_VALUES_ASC)[number];
/** Descendant values from {@link OrderValue}  */
export type OrderValueDesc = (typeof ORDER_VALUES_DESC)[number];
/**
 * Value for ordering a query.
 *
 * - `_nf` suffix stands for 'nulls first'
 * - `_nl` suffix stands for 'nulls last'
 */
export type OrderValue = (typeof ORDER_VALUES)[number];

/**
 * Determines if the given value is an ascendant {@link OrderValue}.
 *
 * @param value to determine
 * @returns if the value is an ascendant {@link OrderValue}
 */
export function isOrderValueAsc(value: unknown): value is OrderValueAsc {
	return ORDER_VALUES_ASC.includes(value as never);
}

/**
 * Determines if the given value is an descendant {@link OrderValue}.
 *
 * @param value to determine
 * @returns if the value is a descendant {@link OrderValue}
 */
export function isOrderValueDesc(value: unknown): value is OrderValueDesc {
	return ORDER_VALUES_DESC.includes(value as never);
}

/**
 * Determines if the given value is an {@link OrderValue}.
 *
 * Note: The `orderValue` schema can also be used
 *
 * @param value to determine
 * @returns if the value is an {@link OrderValue}
 */
export function isOrderValue(value: unknown): value is OrderValue {
	return ORDER_VALUES.includes(value as never);
}
