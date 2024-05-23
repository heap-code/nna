import * as z from "zod";

import type { FilterObject } from "./filter-object";
import { isFilterValueConvertible } from "./filter-value.helper";
import * as FilterValue from "./filter-value.schema";
import { QueryObjectSchema } from "../query.types";

// FIXME: too much cast

/** @internal */
function fromShape<T extends z.ZodObject<z.ZodRawShape>>(
	shape: T["shape"],
	options: ObjectOptions,
): z.AnyZodObject & z.ZodType<z.infer<T>> {
	// Explore the shape to create the filter
	const schema = z
		.object(
			Object.fromEntries(
				Object.entries(shape).map(([key, schema]) => [
					key,
					fromType(schema, options),
				]),
			),
		)
		.partial();

	return options.strict ? schema.strict() : schema;
}

/** @internal */
function fromDiscriminated(
	definition: z.ZodDiscriminatedUnionDef<
		string,
		Array<z.ZodDiscriminatedUnionOption<string>>
	>,
	options: ObjectOptions,
): z.ZodType<FilterObject<z.infer<(typeof definition)["options"][number]>>> {
	const { discriminator } = definition;
	const mapping = definition.options.map(
		({ shape: { [discriminator]: key, ...shape } }) =>
			[key as unknown as z.ZodLiteral<string>, shape] as const,
	);

	// Schema for only the discriminator key as a `FilterValue`
	const discriminatorSchema = fromShape(
		{
			[discriminator]: z.enum(
				mapping.map(([{ value }]) => value) as [string, ...string[]],
			),
		},
		options,
	);

	// The "complex" schema that works if the discriminated key is clearly defined
	const unionSchema = z.discriminatedUnion(
		discriminator,
		// `as never`: The typing for this one is quite complicate to satisfies from the dynamic `map`
		mapping.map(([key, shape]) =>
			z.object({ [discriminator]: key }).merge(fromShape(shape, options)),
		) as never,
	);

	return z.union([unionSchema, discriminatorSchema]);
}

/** @internal */
function fromType(zodType: z.ZodTypeAny, options: ObjectOptions): z.ZodType {
	if (isFilterValueConvertible(zodType)) {
		// The schema use `QueryPrimitive`
		return z.lazy(() => FilterValue.value(zodType, options));
	}

	const { _def } = zodType as
		| QueryObjectSchema
		| z.ZodArray<z.ZodTypeAny>
		| z.ZodLazy<z.ZodTypeAny>
		| z.ZodUnknown;

	switch (_def.typeName) {
		case z.ZodFirstPartyTypeKind.ZodArray:
			// For an array, explore its type
			return z.lazy(() => fromType(_def.type, options));
		case z.ZodFirstPartyTypeKind.ZodLazy:
			return z.lazy(() => fromType(_def.getter(), options));

		case z.ZodFirstPartyTypeKind.ZodObject:
			// For a nested object, it simply needs to explore its shape
			return z.lazy(() => fromShape(_def.shape(), options));
		case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
			return z.lazy(() => fromDiscriminated(_def, options));

		default:
			// Unmanaged/unknown type
			return z.never();
	}
}

/** Options to create an object filter validation schema */
export type ObjectOptions = FilterValue.ValueOptions;

/**
 * Creates a validation schema for an object schema
 *
 * With discriminated union, the discriminated key must be a literal to determine the object.
 * The discriminated key can be filtered as a `FilterValue` but only the key will be taken onto account.
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: ObjectOptions,
): z.ZodType<FilterObject<z.infer<T>>> {
	if (!options) {
		return _schema(schema, {});
	}

	const { _def } = schema;
	return (
		_def.typeName === z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion
			? fromDiscriminated(_def, options)
			: fromShape(_def.shape(), options)
	) as never;
}

export { _schema as object };
