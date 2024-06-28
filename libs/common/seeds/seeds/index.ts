import { empty } from "./empty.seed";
import { simple } from "./simple.seed";
import { SeedData } from "../lib";

export * from "./empty.seed";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
export const SEEDS = {
	a: () => simple,
	empty,
	simple,
} as const satisfies Record<
	string,
	SeedData | ((...args: unknown[]) => SeedData)
>;

interface X<S extends SeedData> {
	refresh: () => Promise<void>;
	seed: S;
}

type A = typeof SEEDS;
type Y = {
	[k in keyof A]: A[k] extends ((
		...args: unknown[]
	) => infer U extends SeedData)
		? U
		: A[k];
};
