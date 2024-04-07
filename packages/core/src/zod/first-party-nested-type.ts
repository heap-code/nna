import * as z from "zod";

import { ZodNestedType } from "./types";

/** Mostly any known Zod type */
export type ZodAnyFirstPartySchemaType =
	| z.ZodFirstPartySchemaTypes
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to use logic as the library one
	| z.ZodReadonly<any>;

/** @internal */
interface ExploreZodSchemaFirstPartyNestedBase<T extends boolean> {
	/** Has the schema been found */
	found: T;
}

/** When a schema was found */
export interface ExploreZodSchemaFirstPartyNestedResultFound<
	T extends ZodAnyFirstPartySchemaType, // Found schema
	U extends ZodAnyFirstPartySchemaType, // schema that replaces
> extends ExploreZodSchemaFirstPartyNestedBase<true> {
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
	replace: (schema: U) => ZodNestedType<U>;
	/** Schema found from the {@link ExploreZodSchemaFirstPartyNestedOptions.lookFor} */
	schema: T;
}
/** When no schema was found */
export type ExploreZodSchemaFirstPartyNestedResultNotFound =
	ExploreZodSchemaFirstPartyNestedBase<false>;

/** Result for {@link findZodSchemaFirstPartyNested} */
export type ExploreZodSchemaFirstPartyNestedResult<
	T extends ZodAnyFirstPartySchemaType,
	U extends ZodAnyFirstPartySchemaType,
> =
	| ExploreZodSchemaFirstPartyNestedResultFound<T, U>
	| ExploreZodSchemaFirstPartyNestedResultNotFound;

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
export function findZodSchemaFirstPartyNested<
	S extends ZodNestedType<ZodAnyFirstPartySchemaType>,
	R extends
		ZodNestedType<ZodAnyFirstPartySchemaType> = ZodNestedType<ZodAnyFirstPartySchemaType>,
>(
	schema: ZodNestedType<ZodAnyFirstPartySchemaType>,
	predicate: (
		schema: ZodNestedType<ZodAnyFirstPartySchemaType>,
	) => schema is S,
): ExploreZodSchemaFirstPartyNestedResult<S, R>;
/**
 * Explores first-level type of Zod schema.
 * That means than any object related schema is untouched
 * (e.g. it will not look in the shape of a {@link z.ZodObject}).
 *
 * @param schema to start the exploration from
 * @param predicate A function to determine when the wanted schema is found
 * @returns result of the exploration
 */
export function findZodSchemaFirstPartyNested<
	R extends
		ZodNestedType<ZodAnyFirstPartySchemaType> = ZodNestedType<ZodAnyFirstPartySchemaType>,
>(
	schema: ZodNestedType<ZodAnyFirstPartySchemaType>,
	predicate: (schema: ZodNestedType<ZodAnyFirstPartySchemaType>) => boolean,
): ExploreZodSchemaFirstPartyNestedResult<
	ZodNestedType<ZodAnyFirstPartySchemaType>,
	R
>;
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
export function findZodSchemaFirstPartyNested<
	R extends
		ZodNestedType<ZodAnyFirstPartySchemaType> = ZodNestedType<ZodAnyFirstPartySchemaType>,
>(
	schema: ZodNestedType<ZodAnyFirstPartySchemaType>,
	predicate: (schema: ZodNestedType<ZodAnyFirstPartySchemaType>) => boolean,
): ExploreZodSchemaFirstPartyNestedResult<
	ZodNestedType<ZodAnyFirstPartySchemaType>,
	R
> {
	const found = predicate(schema);
	if (found) {
		return { found, replace: schema => schema, schema };
	}

	// To replace in nested type and re-apply modifiers
	const nestedReplace = (
		{ innerType }: z.ZodNullableDef | z.ZodOptionalDef | z.ZodReadonlyDef,
		replace: (
			schema: ZodAnyFirstPartySchemaType,
		) => ZodNestedType<ZodAnyFirstPartySchemaType>,
	): ExploreZodSchemaFirstPartyNestedResult<
		ZodAnyFirstPartySchemaType,
		R
	> => {
		const res = findZodSchemaFirstPartyNested(
			innerType as ZodAnyFirstPartySchemaType,
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

/** Typename definition from {@link ZodAnyFirstPartySchemaType} */
export type ZodAnyFirstPartySchemaTypeName =
	ZodAnyFirstPartySchemaType["_def"]["typeName"];

/**
 * Determines if the given schema if of type or given nested type
 *
 * @param schema to test
 * @param types that the schema should be directly or on a nested level
 * @returns if the schema satisfy one the given types
 */
export function isZodSchemaFirstPartyNestedType<
	const T extends ZodAnyFirstPartySchemaTypeName,
>(
	schema: ZodAnyFirstPartySchemaType,
	types: readonly T[],
): schema is ZodNestedType<
	Extract<ZodAnyFirstPartySchemaType, { _def: { typeName: T } }>
> {
	return findZodSchemaFirstPartyNested(schema, ({ _def }) =>
		types.includes(_def.typeName as never),
	).found;
}
