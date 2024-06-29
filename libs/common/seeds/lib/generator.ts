import { Data } from "./data";

/** Function that generates a {@link Data seed} */
export type GeneratorFn = (options?: never) => Data;
/** Generator contains data for a {@link Data seed} generation */
export interface Generator {
	/** Function that generates a seed */
	fn: GeneratorFn;
	/** Name of the generator */
	name: string;
}

/** Extract the options from a {@link Generator} */
export type GeneratorOptions<T extends GeneratorFn> = Parameters<T>[0];
/** Extract the {@link Data} returned from a {@link Generator} */
export type GeneratorReturn<T extends GeneratorFn> = ReturnType<T>;

interface GeneratorArgument<T extends Generator> {
	options?: GeneratorOptions<T["fn"]>;
	seed: T["name"];
}

/** A */
export type GeneratorsToDict<T extends readonly Generator[]> = T extends []
	? Record<string, never>
	: T extends [infer I extends Generator, ...infer R extends Generator[]]
		? GeneratorsToDict<R> &
				((options: GeneratorArgument<I>) => GeneratorReturn<I["fn"]>)
		: never;
