import * as z from "zod";

import type { QueryOrder } from "..";
import * as OrderValue from "./order-value.schema";
import { FilterOptions } from "../filter";
import { QueryObjectSchema } from "../query.types";

/** @internal */
function fromShape<T extends z.ZodObject>(
	shape: T["shape"],
	options: OrderOptions,
): z.ZodObject & z.ZodType<QueryOrder<z.infer<T>>> {
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
	options: OrderOptions,
): z.ZodType<QueryOrder<z.infer<(typeof definition)["options"][number]>>> {
	const { discriminator } = definition;

	return definition.options
		.filter(
			(option): option is z.ZodObject =>
				option._zod.def.type === "object",
		)
		.reduce(
			(type, { shape }) => type.extend(fromShape(shape, options).shape),
			fromShape({ [discriminator]: OrderValue.orderValue }, options),
		);
}

/** @internal */
function fromType(zodType: z.ZodTypeAny, options: OrderOptions): z.ZodType {
	const { def } = zodType as
		| QueryObjectSchema
		| z.ZodArray<z.ZodTypeAny>
		| z.ZodLazy<z.ZodTypeAny>
		| z.ZodNullable<z.ZodTypeAny>
		| z.ZodOptional<z.ZodTypeAny>
		| z.ZodUnknown;

	switch (def.type) {
		case "array":
			// For an array, explore its type
			return z.lazy(() => fromType(def.element, options));
		case "lazy":
			return z.lazy(() => fromType(def.getter(), options));
		case "object":
			// For a nested object, it simply needs to explore its shape
			return z.lazy(() => fromShape(def.shape, options));
		case "nullable":
		case "optional":
			return fromType(def.innerType, options);
		case "union":
			return z.lazy(() => fromDiscriminated(def, options));

		default:
			return OrderValue.orderValue;
	}
}

/** Options to create a query order validation schema */
export type OrderOptions = Pick<FilterOptions, "strict">;

/**
 * Creates a {@link QueryOrder query order} validation schema for an object schema.
 *
 * @param schema the object schema to create this order schema
 * @param options for the creation of the schema
 * @returns the order validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: OrderOptions,
): z.ZodType<QueryOrder<z.infer<T>>> {
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

export { _schema as order };
