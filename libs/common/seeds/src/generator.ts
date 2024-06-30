import * as z from "zod";

import { Generator } from "./lib";
import { empty, random, randomOptionsSchema, simple } from "./seeds";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
const GENERATORS = [
	{ fn: () => empty, name: "empty" },
	{ fn: random, name: "random" },
	{ fn: () => simple, name: "simple" },
] as const satisfies Generator.Meta[];

/** Type of the generate function */
export type Generate = Generator.ToFunction<typeof GENERATORS>;
/** Argument for the {@link Generate} function */
export type GenerateParameter = Generator.ToParameter<typeof GENERATORS>;

/** Validation schema for {@link GenerateParameter} */
export const generateParameterSchema: z.ZodType<GenerateParameter> =
	z.discriminatedUnion("seed", [
		z.object({ seed: z.literal("empty") }),
		z.object({ seed: z.literal("simple") }),
		z.object({ options: randomOptionsSchema, seed: z.literal("random") }),
	]);

/** Generates a seed from the given Meta */
export const generate: Generate = ({ options, seed }) =>
	(GENERATORS.find(({ name }) => name === seed)?.fn(options) as never) ??
	Promise.reject(new Error("No generator found"));
