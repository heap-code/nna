import * as z from "zod";

import type { FilterObject } from "./filter-object";
import { isFilterValueConvertible } from "./filter-value.helper";
import * as FilterValue from "./filter-value.schema";
import { QueryObjectSchema } from "../query.types";

/** @internal */
function fromShape<T extends z.ZodObject>(
	shape: T["shape"],
	options: ObjectOptions,
): z.ZodObject & z.ZodType<z.infer<T>> {
	// Explore the shape to create the filter
	const schema = z
		.object(
			Object.fromEntries(
				Object.entries(shape).map(([key, schema]) => [
					key,
					fromType(schema as never, options),
				]),
			),
		)
		.partial();

	// @ts-expect-error -- FIXME ZOD-V4_UP
	return options.strict ? schema.strict() : schema;
}

/** @internal */
function fromDiscriminated(
	definition: z.core.$ZodDiscriminatedUnionDef,
	options: ObjectOptions,
): z.ZodType<FilterObject<z.infer<(typeof definition)["options"][number]>>> {
	const { discriminator } = definition;
	const mapping = definition.options
		.filter(
			(option): option is z.ZodObject =>
				option._zod.def.type === "object",
		)
		.map(
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
			fromShape(shape, options).extend({ [discriminator]: key }),
		) as never,
	);

	return z.union([unionSchema, discriminatorSchema]);
}

/** @internal */
function fromType(zodType: z.ZodType, options: ObjectOptions): z.ZodType {
	if (isFilterValueConvertible(zodType)) {
		// The schema use `QueryPrimitive`
		return z.lazy(() => FilterValue.value(zodType, options));
	}

	const { def } = zodType as
		| QueryObjectSchema
		| z.ZodArray<z.ZodType>
		| z.ZodLazy<z.ZodType>
		| z.ZodUnknown;

	switch (def.type) {
		case "array":
			// For an array, explore its type
			return z.lazy(() => fromType(def.element, options));
		case "lazy": {
			return z.lazy(() => fromType(def.getter(), options));
		}

		case "object":
			// For a nested object, it simply needs to explore its shape
			return z.lazy(() => fromShape(def.shape, options));
		case "union":
			return z.lazy(() => fromDiscriminated(def, options));

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

	const { def } = schema;
	return (
		def.type === "union"
			? fromDiscriminated(def, options)
			: fromShape(def.shape, options)
	) as never;
}

export { _schema as object };
