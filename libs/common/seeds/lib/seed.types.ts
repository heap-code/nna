import { Data } from "./seed-data";

/** Function that generates a {@link Data} */
export type Generator = (options?: never) => Data;

/** Extract the options from a {@link Generator} */
export type GeneratorOptions<T extends Generator> = Parameters<T>[0];
/** Extract the {@link Data} returned from a {@link Generator} */
export type GeneratorReturn<T extends Generator> = ReturnType<T>;
