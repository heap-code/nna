import type { AnyFunction, ExtendFunctions, KeepPropertiesOf } from "@nna/core";

/**
 * Keep functions and allow additional parameters from the object to be implemented in a controller
 */
export type ControllerFor<T extends object> = ExtendFunctions<
	KeepPropertiesOf<T, AnyFunction>
>;
