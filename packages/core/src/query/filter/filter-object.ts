//import type { EntityKey } from "@mikro-orm/core";

import { FilterValue } from "./filter-value";
import { QueryPrimitive } from "../query.types";

export type CleanKeys<T, K extends keyof T> = K;

export type EntityKey<T = unknown> = keyof {
	[K in keyof T as CleanKeys<T, K>]?: T[K];
};

/** Filter for objects */
export type FilterObject<T> =
	IsAnUnion<T> extends true
		? Record<keyof T, T[keyof T]>
		: {
				// `EntityKey` removes any potential functions
				[K in EntityKey<T>]?: T[K] extends QueryPrimitive
					? FilterValue<T[K]>
					: T[K] extends ReadonlyArray<infer U>
						? FilterObject<U>
						: FilterObject<T[K]>;
			};

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

const v0: IsAnUnion<{ a: number }> = "code";
const v1: IsAnUnion<Ref> = "code";

type AB<T> = T extends infer U | unknown ? U : never;

const x: AB<1 | 2 | 3> = "";
const a: FilterObject<Ref> = { code: 1, getA: {}, type: "idle" };

console.log("(----", a, v0, v1, x);
