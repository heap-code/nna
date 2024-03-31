import type { EntityKey } from "@mikro-orm/core";
import { KeysOfUnion } from "type-fest";

import { FilterValue } from "./filter-value";
import { QueryPrimitive } from "../query.types";

/** @internal */
type IsAnUnion<T> =
	KeysOfUnion<T> extends keyof T
		? false
		: keyof T extends never
			? false
			: true;

/** @internal */
type FilterObjectDiscriminatedImpl<T, Discriminators extends number | string> =
	// `Discriminators` are the values of the discriminated key(s)
	| {
			[Discriminator in Discriminators]?: FilterObjectRaw<
				Omit<
					// Remove the discriminator property as it is not desired to filter on it AND the other properties
					Extract<T, Record<keyof T, Discriminator>>,
					keyof T
				>
			> &
				// Must have the discriminator property to determine the object type
				Record<keyof T, Discriminator>;
	  }[Discriminators]
	// Add only the discrimination key as 'filterable'
	| Record<keyof T, FilterValue<Discriminators>>;

/**
 * {@link FilterObject} for discriminated objects.
 *
 * @returns `never` if not an union
 *
 * @example
 * type Ref = {type: "a"; a: number} | {type: "b"; b: string};
 * const valid: FilterObjectDiscriminated<Ref>[] = [
 * 	{type: {$eq: "a"}},
 * 	{type: "b", b: {$ne: ""}}
 * ]
 * const invalid: FilterObjectDiscriminated<Ref>[] = [
 * 	{type: {$eq: "a"}, a: 1},
 * 	{type: "b", a: 1}
 * ]
 */
export type FilterObjectDiscriminated<T> = [IsAnUnion<T>, T[keyof T]] extends [
	true,
	infer U extends number | string, // The discriminated value(s)
]
	? FilterObjectDiscriminatedImpl<T, U>
	: never;

/** Filter for objects (that are not discriminated) */
export type FilterObjectRaw<T> = {
	// `EntityKey` removes any potential functions
	[K in EntityKey<T>]?: T[K] extends QueryPrimitive
		? FilterValue<T[K]>
		: T[K] extends ReadonlyArray<infer U>
			? FilterObject<U>
			: FilterObject<T[K]>;
};

/** Filter for objects */
export type FilterObject<T> =
	// An empty object is always valid (this also helps with generic types)
	| Record<string, never>
	| (FilterObjectDiscriminated<T> extends never
			? FilterObjectRaw<T>
			: FilterObjectDiscriminated<T>);
