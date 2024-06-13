import { empty } from "./empty.seed";
import { simple } from "./simple.seed";
import { Seed } from "../lib";

export * from "./empty.seed";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
export const SEEDS = {
	empty,
	simple,
} as const satisfies Record<string, Seed | ((...args: unknown[]) => Seed)>;
