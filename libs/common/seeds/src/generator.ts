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
export const generateParameterSchema: z.ZodType<GenerateParameter> =
	z.discriminatedUnion("seed", [
		z.object({ seed: z.literal("empty") }),
		z.object({ seed: z.literal("simple") }),
		z.object({ options: randomOptionsSchema, seed: z.literal("random") }),
	]);

type X<P extends GenerateParameter> = ReturnType<
	NonNullable<Generator.KeepMetaOfName<typeof GENERATORS, P["seed"]>[0]>["fn"]
>;

/** Generates a seed from the given Meta */
export function generate<P extends GenerateParameter>(param: P): Promise<X<P>> {
	const { options, seed } = param;
	return (
		(GENERATORS.find(({ name }) => name === seed)?.fn(options) as never) ??
		Promise.reject(new Error("No generator found"))
	);
}

const y0 = generate({ seed: "empty" });
const y1 = generate({ options: {}, seed: "simple" });
const y2 = generate({ options: {}, seed: "random" });

/** Type of the generate function */
export type Generate = typeof generate;
