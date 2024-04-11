import * as z from "zod";

import { NestedType } from "./types";

/** Mostly any known Zod type */
export type AnyFirstPartySchemaType =
	| z.ZodFirstPartySchemaTypes
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to use logic as the library one
	| z.ZodReadonly<any>;

/** @internal */
interface ExploreSchemaFirstPartyNestedBase<T extends boolean> {
	/** Has the schema been found */
	found: T;
}

/** When a schema was found */
export interface ExploreSchemaFirstPartyNestedResultFound<
	T extends AnyFirstPartySchemaType, // Found schema
	U extends AnyFirstPartySchemaType, // schema that replaces
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
	replace: (schema: U) => NestedType<U>;
	/** Schema found from the {@link ExploreZodSchemaFirstPartyNestedOptions.lookFor} */
	schema: T;
}
/** When no schema was found */
export type ExploreSchemaFirstPartyNestedResultNotFound =
	ExploreSchemaFirstPartyNestedBase<false>;

/** Result for {@link findSchemaFirstPartyNested} */
export type ExploreSchemaFirstPartyNestedResult<
	T extends AnyFirstPartySchemaType,
	U extends AnyFirstPartySchemaType,
> =
	| ExploreSchemaFirstPartyNestedResultFound<T, U>
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
	R extends
		NestedType<AnyFirstPartySchemaType> = NestedType<AnyFirstPartySchemaType>,
>(
	schema: NestedType<AnyFirstPartySchemaType>,
	predicate: (schema: NestedType<AnyFirstPartySchemaType>) => schema is S,
): ExploreSchemaFirstPartyNestedResult<S, R>;
/**
 * Explores first-level type of Zod schema.
 * That means than any object related schema is untouched
 * (e.g. it will not look in the shape of a {@link z.ZodObject}).
 *
 * @param schema to start the exploration from
 * @param predicate A function to determine when the wanted schema is found
 * @returns result of the exploration
 */
export function findSchemaFirstPartyNested<
	R extends
		NestedType<AnyFirstPartySchemaType> = NestedType<AnyFirstPartySchemaType>,
>(
	schema: NestedType<AnyFirstPartySchemaType>,
	predicate: (schema: NestedType<AnyFirstPartySchemaType>) => boolean,
): ExploreSchemaFirstPartyNestedResult<NestedType<AnyFirstPartySchemaType>, R>;
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
	R extends
		NestedType<AnyFirstPartySchemaType> = NestedType<AnyFirstPartySchemaType>,
>(
	schema: NestedType<AnyFirstPartySchemaType>,
	predicate: (schema: NestedType<AnyFirstPartySchemaType>) => boolean,
): ExploreSchemaFirstPartyNestedResult<NestedType<AnyFirstPartySchemaType>, R> {
	const found = predicate(schema);
	if (found) {
		return { found, replace: schema => schema, schema };
	}

	// To replace in nested type and re-apply modifiers
	const nestedReplace = (
		{ innerType }: z.ZodNullableDef | z.ZodOptionalDef | z.ZodReadonlyDef,
		replace: (
			schema: AnyFirstPartySchemaType,
		) => NestedType<AnyFirstPartySchemaType>,
	): ExploreSchemaFirstPartyNestedResult<AnyFirstPartySchemaType, R> => {
		const res = findSchemaFirstPartyNested(
			innerType as AnyFirstPartySchemaType,
			predicate,
		);

		return res.found
			? { ...res, replace: schema => replace(res.replace(schema)) as R }
			: res;
	};

	const definition = schema._def;
	switch (definition.typeName) {
		case z.ZodFirstPartyTypeKind.ZodNullable:
			return nestedReplace(definition, schema => schema.nullable());
		case z.ZodFirstPartyTypeKind.ZodOptional:
			return nestedReplace(definition, schema => schema.optional());
		case z.ZodFirstPartyTypeKind.ZodReadonly:
			return nestedReplace(definition, schema => schema.readonly());
	}

	return { found: false };
}

/** Typename definition from {@link AnyFirstPartySchemaType} */
export type AnyFirstPartySchemaTypeName =
	AnyFirstPartySchemaType["_def"]["typeName"];

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
	schema: AnyFirstPartySchemaType,
	types: readonly T[],
): schema is NestedType<
	Extract<AnyFirstPartySchemaType, { _def: { typeName: T } }>
> {
	return findSchemaFirstPartyNested(schema, ({ _def }) =>
		types.includes(_def.typeName as never),
	).found;
}
