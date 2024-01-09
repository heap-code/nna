import { z } from "zod";

import type { FilterObject } from "./filter-object";
import { isFilterValueConvertible } from "./filter-value.helper";
import * as FilterValue from "./filter-value.schema";

/** @internal */
function fromShape<T extends z.ZodObject<z.ZodRawShape>>(
	shape: T["shape"],
	options: ObjectOptions,
) {
	// Explore the shape to create the filter
	return z
		.object(
			Object.fromEntries(
				Object.entries(shape)
					.map(([key, schema]) => [key, fromType(schema, options)])
					.filter(([, schema]) => schema !== null),
			),
		)
		.partial() satisfies z.ZodType<FilterObject<z.infer<T>>>;
}

/** @internal */
function fromDiscriminated(
	definition: z.ZodDiscriminatedUnionDef<
		string,
		Array<z.ZodDiscriminatedUnionOption<string>>
	>,
	options: ObjectOptions,
): z.ZodType<FilterObject<z.infer<(typeof definition)["options"][number]>>> {
	// TODO
	const { discriminator } = definition;
	const mapping = definition.options.map(
		({ shape: { [discriminator]: key, ...shape } }) =>
			[key as unknown as z.ZodLiteral<string>, shape] as const,
	);

	const keys = z.enum(
		mapping.map(([{ value }]) => value) as [string, ...string[]],
	);

	const a0 = z.object({ [discriminator]: keys });
	const a1 = z.discriminatedUnion(
		discriminator,
		mapping.map(([key, shape]) =>
			z
				.object({
					[discriminator]: key,
				})
				.merge(fromShape(shape, options).strict()),
		),
	);

	const a2 = fromShape(z.object({ [discriminator]: keys }).shape, options);
	//const a2 = z.object({ [discriminator]: fromType(keys, options)! });

	return z.custom().transform((val, ctx) => {
		if (a0.safeParse(val).success) {
			const y = a1.safeParse(val);

			if (y.success) {
				return y.data;
			}

			for (const issue of y.error.issues) {
				ctx.addIssue(issue);
			}
			return {};
		}

		const y = a2.safeParse(val);

		if (y.success) {
			return y.data;
		}

		for (const issue of y.error.issues) {
			ctx.addIssue(issue);
		}
		return {};
	});
}

/** @internal */
function fromType(
	zodType: z.ZodTypeAny,
	options: ObjectOptions,
): z.ZodType | null {
	if (isFilterValueConvertible(zodType)) {
		// The schema use `QueryPrimitive`
		return z.lazy(() => FilterValue.value(zodType, options));
	}

	const { _def } = zodType as
		| ObjectSchema
		| z.ZodArray<z.ZodTypeAny>
		| z.ZodUnknown;

	if (_def.typeName === z.ZodFirstPartyTypeKind.ZodArray) {
		// For an array, explore its type
		return z.lazy(() => fromType(_def.type, options) || z.never());
	}

	if (_def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
		// For a nested object, it simply needs to explore its shape
		return z.lazy(() => fromShape(_def.shape(), options));
	}

	if (_def.typeName === z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion) {
		return z.lazy(() => fromDiscriminated(_def, options));
	}

	// Unmanaged/unkown type
	return null;
}

export type ObjectSchema =
	| z.ZodDiscriminatedUnion<string, Array<z.ZodObject<z.ZodRawShape>>>
	| z.ZodObject<z.ZodRawShape>;

/** Options to create an object filter validation schema */
export type ObjectOptions = FilterValue.ValueOptions;

/**
 * Creates a validation schema for an object schema
 *
 * With discriminated union, the discriminated key must be a literal to determine the object.
 * The discrimanted key can be filtered as a `FilterValue` but only the key will be taken onto account.
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function _schema<T extends ObjectSchema>(
	schema: T,
	options?: ObjectOptions,
): z.ZodType<FilterObject<z.infer<T>>> {
	if (!options) {
		return _schema(schema, {});
	}

	const { _def } = schema;
	if (_def.typeName === z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion) {
		return fromDiscriminated(_def, options);
	}

	return fromShape(_def.shape(), options);
}

export { _schema as object };
