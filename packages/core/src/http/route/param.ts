import * as z from "zod";

/** Map of available types (from zod) for route parameters */
export interface ParamValidationSchemaMap {
	/** The param is of number type */
	number: z.ZodNumber;
	/** The param is of string type */
	string: z.ZodString;
}
/** Available types for route parameters (and validation) */
export type ParamValidation = keyof ParamValidationSchemaMap;

/** A param is a parameter in a route path (e.g. `/users/:id` => `id`) */
export interface Param {
	/** The name of the parameter (only alphabetical) */
	param: string;
	/** Type of the parameter (for validation) */
	validation: ParamValidation;
}

/** @internal */
type ParamToValidationSchema<T extends Param> = Record<
	T["param"],
	ParamValidationSchemaMap[T["validation"]]
>;

/** @internal */
type ParamsToValidationShape<PARAMS extends readonly Param[]> =
	PARAMS extends readonly [
		infer ITEM extends Param,
		...infer REST extends Param[],
	]
		? // Take first element and intersect it with the rest of the array
			ParamsToValidationShape<REST> & ParamToValidationSchema<ITEM>
		: // empty object for the intersection
			NonNullable<unknown>;

/**
 * Converts an array of {@link Param} definitions into a validation schema
 *
 * @example
 * type Params = ParamsToValidationSchema<[{param: "id";typing: "number"}, {param: "name";typing: "string"}]>;
 * // equivalent
 * type Params = z.ZodObject<{id: z.ZodNumber; name: z.ZodString}>;
 */
export type ParamsToValidationSchema<PARAMS extends readonly Param[]> =
	z.ZodObject<ParamsToValidationShape<PARAMS>>;
/**
 * Converts an array of {@link Param} definitions into an interface
 *
 * @example
 * type Params = ParamsToObject<[{param: "id";typing: "number"}, {param: "name";typing: "string"}]>;
 * // equivalent
 * interface Params{id: number; name: string};
 */
export type ParamsToObject<PARAMS extends readonly Param[]> = z.infer<
	ParamsToValidationSchema<PARAMS>
>;

/** @internal */
function paramValidationSchema(
	type: ParamValidation,
): ParamValidationSchemaMap[typeof type] {
	switch (type) {
		case "number":
			// Need `coerce` as the param is in the URL
			return z.coerce.number();
		case "string":
			return z.string();
	}
}

/**
 * Creates a validation schema for the route parameters
 *
 * @param params to create the schema from
 * @returns a schema for parameters validation
 */
export function paramsSchema<const T extends readonly Param[]>(
	params: T,
): ParamsToValidationSchema<T> {
	return z.object(
		Object.fromEntries(
			params.map(({ param, validation }) => [
				param,
				paramValidationSchema(validation),
			]),
		),
	) as ParamsToValidationSchema<T>;
}
