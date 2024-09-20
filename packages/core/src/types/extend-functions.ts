import { AnyFunction, PushParameters, UnshiftParameters } from "../types";

/**
 * Changes the given object by pushing additional parameters in all its functions/methods.
 * Does nothing to other properties.
 *
 * It allows to extend its use, notably when implementing controllers.
 *
 * @example
 * interface A {
 * 	a(arg1: number): void;
 * 	b: string;
 * }
 * type B0 = ExtendFunctionsByPush<A, [string, Date]>;
 * interface B1 { // Equal to B0
 * 	a(arg1: number, arg2: string, arg3: Date): void;
 * 	b: string;
 * }
 * @example
 * interface DataHttp {
 * 	create(body: DataBody): Promise<unknown>;
 * }
 * \@Controller()
 * class DataController implements ExtendFunctionsByPush<DataHttp> {
 * 	\Post()
 * 	create(@Body() body: DataBody,@Req() req,@Res() res) {}
 * }
 */
export type ExtendFunctionsByPush<
	T extends object,
	P extends unknown[] = never[],
> = {
	[K in keyof T]: T[K] extends AnyFunction ? PushParameters<T[K], P> : T[K];
};
/**
 * Identical to {@link ExtendFunctionsByPush}, but will set ths parameters at the beginning.
 *
 * @example
 * interface A {
 * 	a(arg1: number): void;
 * 	b: string;
 * }
 * type B0 = ExtendFunctionsByUnshift<A, [string, Date]>;
 * interface B1 { // Equal to B0
 * 	a(arg1: string, arg2: Date, arg3: number): void;
 * 	b: string;
 * }
 */
export type ExtendFunctionsByUnshift<
	T extends object,
	P extends unknown[] = never[],
> = {
	[K in keyof T]: T[K] extends AnyFunction
		? UnshiftParameters<T[K], P>
		: T[K];
};

// Default is "ByPush"
export type { ExtendFunctionsByPush as ExtendFunctions };
