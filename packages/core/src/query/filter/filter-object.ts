import type { EntityKey } from "@mikro-orm/core";

import { FilterValue } from "./filter-value";
import { QueryPrimitive } from "../query.types";

/**
 * @example
 * type Ref = {type: "a"; a: number} | {type: "b"; b: string};
 * const valid: FilterObjectDiscriminated<Ref, Ref["type"]>[] = [
 * 	{type: {$eq: "a"}},
 * 	{type: "b", b: {$ne: ""}}
 * ]
 * const invalid: FilterObjectDiscriminated<Ref, Ref["type"]>[] = [
 * 	{type: {$eq: "a"}, a: 1},
 * 	{type: "b", a: 1}
 * ]
 */
export type FilterObjectDiscriminated<T, Kinds extends number | string> =
	| {
			[Kind in Kinds]: Omit<
				FilterObject<Extract<T, Record<keyof T, Kind>>>,
				keyof T
			> &
				Record<keyof T, Kind>;
	  }[Kinds]
	// Add only the discrimination key as 'filterable'
	| Partial<Record<keyof T, FilterValue<Kinds>>>;

export type FilterObject0<T> = {
	// `EntityKey` removes any potential functions
	[K in EntityKey<T>]?: T[K] extends QueryPrimitive
		? FilterValue<T[K]>
		: T[K] extends ReadonlyArray<infer U>
			? FilterObject<U>
			: FilterObject<T[K]>;
};

/** Filter for objects */
export type FilterObject<T> = [IsAnUnion<T>, T[keyof T]] extends [
	true,
	infer U extends number | string, // The discrimination value(s)
]
	? FilterObjectDiscriminated<T, U>
	: FilterObject0<T>;

type Ref =
	| {
			code: number;
			getA: () => number;
			type: "error";
	  }
	| {
			data: string;
			type: "success";
	  }
	| {
			date: Date | null;
			type: "idle";
	  };

// https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type
type KeysOfUnion<T> = T extends T ? keyof T : never;
type IsAnUnion<T> = KeysOfUnion<T> extends keyof T ? false : true;

const v0: IsAnUnion<{ a: number }> = false;
const v1: IsAnUnion<Ref> = true;

const a: Array<FilterObject<Ref>> = [
	{},
	{ type: "success" },
	{ type: { $eq: "idle" } },
	{ code: { $eq: 0 }, type: "error" },
	{ date: null, type: "idle" },

	// @ts-expect-error
	{ code: 1, type: "idle" },
];

console.log("(----", a, v0, v1);
