import * as z from "zod";

import { Generator } from "./lib";
import { empty, random, randomOptionsSchema, simple } from "./seeds";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
const GENERATORS = [
	{ fn: () => empty, name: "empty" },
	{ fn: random, name: "random" },
	{ fn: () => simple, name: "simple" },
] as const satisfies Generator.Meta[];

/** Argument for the {@link Generate} function */
export type GenerateParameter = Generator.ToParameter<typeof GENERATORS>;

/** Validation schema for {@link GenerateParameter} */
export const generateParameterSchema = z.discriminatedUnion("seed", [
	z.object({ seed: z.literal("empty") }),
	z.object({ seed: z.literal("simple") }),
	z.object({ options: randomOptionsSchema, seed: z.literal("random") }),
]) satisfies z.ZodType<GenerateParameter>;

export type GetSeedFromGenerator<P extends GenerateParameter> = ReturnType<
	NonNullable<Generator.KeepMetaOfName<typeof GENERATORS, P["seed"]>[0]>["fn"]
>;

/**
 * Generates a seed from the given Meta and returns it
 *
 * Use an intermediary function to avoid too much duplicated code on tests with (`beforeAll`/`beforeEach`):
 *
 * @example
 * // Set a refresh function
 * const refresh = () => seeder.generate({ seed: "empty" });
 * // Get defined type from the refresh
 * let seed: Awaited<ReturnType<typeof refresh>>;
 * beforeEach(async () => {
 * 	// Get the value at each run
 * 	seed = await refresh();
 * });
 */
export function generate<P extends GenerateParameter>(
	parameter: P,
): Promise<GetSeedFromGenerator<P>> {
	const { options, seed } = parameter;
	return (
		(GENERATORS.find(({ name }) => name === seed)?.fn(options) as never) ??
		Promise.reject(new Error("No generator found"))
	);
}

/** Type of the generate function */
export type Generate = typeof generate;
