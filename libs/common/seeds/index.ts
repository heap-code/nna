import { Seed } from "./lib";
import { empty } from "./seeds";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
export const SEEDS = {
	empty,
} as const satisfies Record<string, Seed | ((...args: unknown[]) => Seed)>;

export type { Seed } from "./lib";
