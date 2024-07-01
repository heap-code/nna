import { KeepInArrayWhen } from "@nna/core";

import type { Data } from "./data";

/** Function that generates a {@link Data seed} */
export type Generator = (options?: object) => Data | Promise<Data>;
/** Generator contains data for a {@link Data seed} generation */
export interface Meta {
	/** Function that generates a seed */
	fn: Generator;
	/** Name of the generator */
	name: string;
}

/** Parameter for a seed generation */
export interface MetaParameter<T extends Meta> {
	/** Options for a {@link Data seed} generation */
	options?: Parameters<T["fn"]>[0] | Record<string, never>;
	/** The (unique) name for the seed to generate */
	seed: T["name"];
}

/** Infer parameter union type from {@link Meta}s */
export type ToParameter<T extends readonly Meta[]> = T extends [
	infer ITEM extends Meta,
	...infer REST extends readonly Meta[],
]
	? REST extends readonly []
		? MetaParameter<ITEM>
		: MetaParameter<ITEM> | ToParameter<REST>
	: never;

export type KeepMetaOfName<
	M extends readonly Meta[],
	K extends M[number]["name"],
> = KeepInArrayWhen<M, { name: K }>;
