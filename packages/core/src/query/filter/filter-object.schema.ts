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
function fromType(
	zodType: z.ZodTypeAny,
	options: ObjectOptions,
): z.ZodType | null {
	if (isFilterValueConvertible(zodType)) {
		// The schema use `QueryPrimitive`
		return z.lazy(() => FilterValue.value(zodType, options));
	}

	const { _def } = zodType as
		| z.ZodArray<z.ZodTypeAny>
		| z.ZodDiscriminatedUnion<string, Array<z.ZodObject<z.ZodRawShape>>>
		| z.ZodObject<z.ZodRawShape>
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
		const { discriminator, options } = _def;

		const b = options.map(
			({ shape: { [discriminator]: key, ...shape } }) =>
				[key as unknown as z.ZodLiteral<string>, shape] as const,
		);

		const ff = z.enum(b.map(([a]) => a.value));

		return z
			.discriminatedUnion(
				discriminator,
				b.map(([key, shape]) =>
					fromShape(shape, options).extend({ [discriminator]: key }),
				),
			)
			.or(z.object({ [discriminator]: fromType(ff, options) }));
	}

	// Unmanaged/unkown type
	return null;
}

/** Options to create an object filter validation schema */
export type ObjectOptions = FilterValue.ValueOptions;

/**
 * Creates a validation schema for an object schema
 *
 * @param schema the object schema to create this filter
 * @param options for the creation of the schema
 * @returns the filter validation schema for the given schema
 */
function _schema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: ObjectOptions,
) {
	return fromShape(schema.shape, options ?? {}) satisfies z.ZodType<
		FilterObject<z.infer<T>>
	>;
}

export { _schema as object };
