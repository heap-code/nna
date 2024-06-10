import { AnyFunction, PushParameters } from "../types";

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
 * type B0 = <A, [string, Date]>;
 * interface B1 { // Equal to B0
 * 	a(arg1: number, arg2: string, arg3: Date): void;
 * 	b: string;
 * }
 * @example
 * interface DataHttp {
 * 	create(body: DataBody): Promise<unknown>;
 * }
 * \@Controller()
 * class DataController implements <DataHttp> {
 * 	\Post()
 * 	create(@Body() body: DataBody,@Req() req,@Res() res) {}
 * }
 */
export type ExtendFunctions<T extends object, P extends unknown[] = never[]> = {
	[K in keyof T]: T[K] extends AnyFunction ? PushParameters<T[K], P> : T[K];
};
