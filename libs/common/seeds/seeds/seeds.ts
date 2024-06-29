import { empty } from "./empty.seed";
import { random } from "./random.seed";
import { simple } from "./simple.seed";
import type { Seeding } from "..";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
export const SEEDS = {
	empty: () => empty,
	random,
	simple: () => simple,
} as const satisfies Record<string, Seeding.Generator>;

/** Type for {@link SEEDS} */
export type SeedDict = typeof SEEDS;
/** Keys for {@link SeedDict} */
export type SeedKey = keyof SeedDict;

/** Known keys of {@link SEEDS} */
export const SEED_KEYS = Object.keys(SEEDS) as readonly SeedKey[];
