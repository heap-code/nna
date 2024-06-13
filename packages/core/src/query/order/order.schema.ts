import * as z from "zod";

import * as OrderValue from "./order-value.schema";
import type { QueryOrder } from "..";
import { FilterOptions } from "../filter";
import { QueryObjectSchema } from "../query.types";

/** @internal */
function fromShape<T extends z.ZodObject<z.ZodRawShape>>(
	shape: T["shape"],
	options: OrderOptions,
) {
	const schema = z
		.object(
			Object.fromEntries(
				Object.entries(shape).map(([key, schema]) => [
					key,
					fromType(schema, options),
				]),
			),
		)
		.partial() satisfies z.ZodType<QueryOrder<z.infer<T>>>;

	return options.strict ? schema.strict() : schema;
}

/** @internal */
function fromDiscriminated(
	definition: z.ZodDiscriminatedUnionDef<
		string,
		Array<z.ZodDiscriminatedUnionOption<string>>
	>,
	options: OrderOptions,
): z.ZodType<QueryOrder<z.infer<(typeof definition)["options"][number]>>> {
	const { discriminator } = definition;

	return definition.options.reduce(
		(type, { shape }) => type.merge(fromShape(shape, options)),
		fromShape({ [discriminator]: OrderValue.orderValue }, options),
	);
}

/** @internal */
function fromType(zodType: z.ZodTypeAny, options: OrderOptions): z.ZodType {
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

	const { _def } = schema;
	return _def.typeName === z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion
		? fromDiscriminated(_def, options)
		: fromShape(_def.shape(), options);
}

export { _schema as order };
