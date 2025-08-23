import * as z from "zod";

import { _NestedType, NestedType } from "./types";

/** Mostly any known Zod type */
export type AnyFirstPartySchemaType = z.ZodType;
/** Typename definition from {@link AnyFirstPartySchemaType} */
export type AnyFirstPartySchemaTypeName =
	AnyFirstPartySchemaType["_zod"]["def"]["type"];

/** @internal */
interface ExploreSchemaFirstPartyNestedBase<T extends boolean> {
	/** Has the schema been found */
	found: T;
}

/** When a schema was found */
export interface ExploreSchemaFirstPartyNestedResultFound<
	T extends AnyFirstPartySchemaType, // Found schema
> extends ExploreSchemaFirstPartyNestedBase<true> {
	/**
	 * Replace the found schema in the "tree".
	 * It re-apply the modification of the parents.
	 *
	 * @example
	 * type Found = z.ZodOptional<z.ZodReadonly<z.ZodDate>>;
	 * const replaced: z.ZodOptional<z.ZodReadonly<z.ZodObject>> = replace(z.object({}));
	 * @param schema to replace the current for
	 * @returns the tree of with the replaced schema
	 */
	replace: <P extends z.ZodType>(schema: P) => NestedType<P>;
	/** Schema found from the {@link ExploreZodSchemaFirstPartyNestedOptions.lookFor} */
	schema: T;
}
/** When no schema was found */
export type ExploreSchemaFirstPartyNestedResultNotFound =
	ExploreSchemaFirstPartyNestedBase<false>;

/** Result for {@link findSchemaFirstPartyNested} */
export type ExploreSchemaFirstPartyNestedResult<
	T extends AnyFirstPartySchemaType,
> =
	| ExploreSchemaFirstPartyNestedResultFound<T>
	| ExploreSchemaFirstPartyNestedResultNotFound;

/**
 * Explores first-level type of Zod schema.
 * That means than any object related schema is untouched
 * (e.g. it will not look in the shape of a {@link z.ZodObject}).
 *
 * @example
 * findZodSchemaFirstPartyNested(schema, (s): s is z.ZodDate => false)
 * @param schema to start the exploration from
 * @param predicate A function to determine when the wanted schema is found.
 * 	It can use a 'type-predicate' to determine the returned type
 * @returns result of the exploration
 */
export function findSchemaFirstPartyNested<
	S extends NestedType<AnyFirstPartySchemaType>,
>(
	schema: NestedType<AnyFirstPartySchemaType>,
	predicate: (schema: NestedType<AnyFirstPartySchemaType>) => schema is S,
): ExploreSchemaFirstPartyNestedResult<S>;
/**
 * Explores first-level type of Zod schema.
 * That means than any object related schema is untouched
 * (e.g. it will not look in the shape of a {@link z.ZodObject}).
 *
 * @param schema to start the exploration from
 * @param predicate A function to determine when the wanted schema is found
 * @returns result of the exploration
 */
export function findSchemaFirstPartyNested(
	schema: NestedType<AnyFirstPartySchemaType>,
	predicate: (schema: NestedType<AnyFirstPartySchemaType>) => boolean,
): ExploreSchemaFirstPartyNestedResult<NestedType<AnyFirstPartySchemaType>>;
/**
 * Explores first-level type of Zod schema.
 * That means than any object related schema is untouched
 * (e.g. it will not look in the shape of a {@link z.ZodObject}).
 *
 * @example
 * findZodSchemaFirstPartyNested(schema, (s): s is z.ZodDate => false)
 * @param schema to start the exploration from
 * @param predicate A function to determine when the wanted schema is found.
 * 	It can use a 'type-predicate' to determine the returned type
 * @returns result of the exploration
 */
export function findSchemaFirstPartyNested(
	schema: NestedType<AnyFirstPartySchemaType>,
	predicate: (schema: NestedType<AnyFirstPartySchemaType>) => boolean,
): ExploreSchemaFirstPartyNestedResult<NestedType<AnyFirstPartySchemaType>> {
	const found = predicate(schema);
	if (found) {
		return { found, replace: schema => schema, schema };
	}

	// To replace in nested type and re-apply modifiers
	const nestedReplace = (
		{ innerType }: (z.ZodNullable | z.ZodOptional | z.ZodReadonly)["def"],
		replace: (schema: z.ZodType) => NestedType<AnyFirstPartySchemaType>,
	): ExploreSchemaFirstPartyNestedResult<AnyFirstPartySchemaType> => {
		const res = findSchemaFirstPartyNested(innerType as never, predicate);

		if (!res.found) {
			return res;
		}

		return {
			...res,
			replace: schema => replace(res.replace(schema)) as never,
		};
	};

	const definition = (schema as _NestedType<z.ZodType> | z.ZodString).def;
	switch (definition.type) {
		case "nullable":
			return nestedReplace(definition, schema => schema.nullable());
		case "optional":
			return nestedReplace(definition, schema => schema.optional());
		case "readonly":
			return nestedReplace(definition, schema => schema.readonly());
	}

	return { found: false };
}

/**
 * Determines if the given schema if of type or given nested type
 *
 * @param schema to test
 * @param types that the schema should be directly or on a nested level
 * @returns if the schema satisfy one the given types
 */
export function isSchemaFirstPartyNestedType<
	const T extends AnyFirstPartySchemaTypeName,
>(
	schema: z.ZodType,
	types: readonly T[],
): schema is NestedType<
	Extract<AnyFirstPartySchemaType, { def: { type: T } }>
> {
	return findSchemaFirstPartyNested(schema, ({ _zod }) =>
		types.includes(_zod.def.type as never),
	).found;
}
