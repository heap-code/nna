import { empty } from "./empty.seed";
import { random } from "./random.seed";
import { simple } from "./simple.seed";
import type { Seeding } from "..";

/** Known seeds or seed generators (e.g. with random data for benchmark) */
export const GENERATORS = [
	{ fn: () => empty, name: "empty" },
	{ fn: random, name: "random" },
	{ fn: () => simple, name: "simple" },
] as const satisfies Seeding.Generator[];

type XXXX = Seeding.GeneratorsToDict<typeof GENERATORS>;

declare const y: XXXX;

const y0 = y({ options: undefined, seed: "simple" });
const y1 = y({ options: undefined, seed: "empty" });
const y2 = y({ options: {}, seed: "random" });

declare const x: XXXX extends (...p: infer P) => infer R
	? (...r: P) => R
	: never;

const x0 = x({ options: undefined, seed: "simple" });
const x1 = x({ options: undefined, seed: "empty" });
const x2 = x({ options: {}, seed: "random" });
