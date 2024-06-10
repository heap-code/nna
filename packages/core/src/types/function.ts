/** Any function type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Need to be `any` to work properly
export type AnyFunction = (...args: any) => any;

/**
 * Change a function definition by adding parameters at the beginning of the exiting ones.
 *
 * @template FN the function to modify
 * @template PARAMS the parameters to unshift
 */
export type UnshiftParameters<
	FN extends AnyFunction,
	PARAMS extends unknown[],
> = FN extends (...args: infer P) => infer R
	? (...args: [...PARAMS, ...P]) => R
	: never;

/**
 * Change a function definition by adding parameters at the end of the exiting ones.
 *
 * @template FN the function to modify
 * @template PARAMS the parameters to push
 */
export type PushParameters<
	FN extends AnyFunction,
	PARAMS extends unknown[],
> = FN extends (...args: infer P) => infer R
	? (...args: [...P, ...PARAMS]) => R
	: never;
