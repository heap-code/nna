import * as z from "zod";

import { dateString } from "./date-string";
import {
	AnyFirstPartySchemaType,
	findSchemaFirstPartyNested,
} from "./first-party-nested-type";

/** @internal */
const ZOD_OFJ_TYPE = [
	// OFJ => Object-For-JSON
	"array",
	"date",
	"union",
	"lazy",
	"object",
] as const satisfies Array<z.ZodType["def"]["type"]>;
/** @internal */
function isOFJ(
	schema: AnyFirstPartySchemaType,
): schema is
	| z.ZodArray
	| z.ZodDate
	| z.ZodDiscriminatedUnion
	| z.ZodLazy
	| z.ZodObject {
	return ZOD_OFJ_TYPE.includes(schema.def.type as never);
}

/** @internal */
function fromProperty<const T extends z.core.$ZodType>(
	propertySchema: T,
): T | false {
	const result = findSchemaFirstPartyNested(
		propertySchema as never as z.ZodType,
		isOFJ,
	);
	if (!result.found) {
		return false;
	}

	const { schema } = result;
	const definition = schema.def;
	switch (definition.type) {
		case "array": {
			const previousType = definition.element;
			const updateType = fromProperty(previousType);

			return updateType === false || updateType === previousType
				? false
				: // @ts-expect-error -- FIXME ZOD-V4_UP
					(result.replace(z.array(updateType).pipe(schema)) as T);
		}

		case "date":
			return (
				result
					.replace(dateString)
					// @ts-expect-error -- FIXME ZOD-V4_UP
					.pipe(propertySchema) as T
			);

		// The ternaries are here to reduce the number of new object references
		case "union": {
			const updateType = fromDiscriminated(schema as ZodDiscriminated);

			return updateType === schema
				? false
				: // @ts-expect-error -- FIXME ZOD-V4_UP
					(result.replace(updateType) as T);
		}
		case "object": {
			const updateType = fromObject(schema as ZodObject);

			return updateType === schema
				? false
				: // @ts-expect-error -- FIXME ZOD-V4_UP
					(result.replace(updateType) as T);
		}

		case "lazy":
			return result.replace(
				// Still return a `lazy` (even if it can be extracted here)
				//	to avoid unnecessary calculation (e.g. if it is optional)
				z.lazy(() => {
					const updateType = definition.getter() as z.ZodType;
					return fromProperty(updateType) || updateType;
				}),
			) as never as T;
	}
}

/** @internal */
function fromObject<T extends ZodObject>(schema: T): T {
	return Object.entries(schema.shape).reduce(
		(previous, [key, propertySchema]) => {
			const updateType = fromProperty(propertySchema);

			// The ternary is here to reduce the number of new object references
			return updateType === false
				? previous
				: (previous.extend({ [key]: updateType }) as typeof previous);
		},
		schema,
	);
}

/** @internal */
function fromDiscriminated<T extends ZodDiscriminated>(schema: T): T {
	const { def } = schema._zod;
	const options = def.options.map(
		option => [option, fromProperty(option)] as const,
	);

	if (options.every(([, updated]) => updated === false)) {
		// Nothing to change
		return schema;
	}

	return z.discriminatedUnion(
		def.discriminator,
		options.map(([original, updated]) =>
			updated === false ? original : updated,
		) as never,
	) as unknown as T;
}

/** @internal */
type ZodDiscriminated = z.ZodDiscriminatedUnion;
/** @internal */
type ZodObject = z.ZodObject<z.ZodRawShape>;
/** Zod Object schemas that can be made "JSON compatible */
export type ObjectForJson = ZodDiscriminated | ZodObject;

/**
 * Makes a given Zod schema compatible for JSON use.
 * It mainly focuses on allowing `z.date()` as date string
 * 	and then transform back to Date
 * 	so final parse and type are still the same
 *
 * @param schema to make "JSON-compatible"
 * @returns a new schema "JSON-compatible" or the given input if no change is needed
 */
export function objectForJson<const T extends ObjectForJson>(schema: T): T {
	const schemaJSON = fromProperty(schema);
	return schemaJSON === false ? schema : (schemaJSON as T);
}
