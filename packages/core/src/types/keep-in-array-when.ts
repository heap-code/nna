/**
 * Keep from the array type the items that extends the second template
 *
 * @template ARRAY array to "filter"
 * @template TARGET type the items must extends to kept them
 *
 * @example
 * const myArray = [1, 2, "abc"] as const;
 * type A = KeepInArrayWhen<typeof myArray, "b" | 2>;
 * declare const y: A; // [2, "b"]
 */
export type KeepInArrayWhen<
	ARRAY extends readonly unknown[],
	TARGET,
> = ARRAY extends readonly [infer ITEM, ...infer REST]
	? // Verify if the first element fullfil the "predicate"
		ITEM extends TARGET
		? readonly [ITEM, ...KeepInArrayWhen<REST, TARGET>]
		: KeepInArrayWhen<REST, TARGET>
	: // Empty ARRAY
		[];
