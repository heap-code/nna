import * as z from "zod";

import { dateString } from "./date-string";
import {
	ZodAnyFirstPartySchemaType,
	findZodSchemaFirstPartyNested,
} from "./first-party-nested-type";

/** @internal */
const ZOD_OFJ_TYPE = [
	// OFJ => Object-For-JSON
	z.ZodFirstPartyTypeKind.ZodDate,
	z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
	z.ZodFirstPartyTypeKind.ZodObject,
] as const;
/** @internal */
function isOFJ(
	schema: ZodAnyFirstPartySchemaType,
): schema is Extract<
	ZodAnyFirstPartySchemaType,
	{ _def: { typeName: (typeof ZOD_OFJ_TYPE)[number] } }
> {
	return ZOD_OFJ_TYPE.includes(schema._def.typeName as never);
}

/** @internal */
function fromProperty<T extends z.ZodTypeAny>(propertySchema: T): T | false {
	const result = findZodSchemaFirstPartyNested(propertySchema, isOFJ);
	if (!result.found) {
		return false;
	}

	const { schema } = result;
	const definition = schema._def;
	switch (definition.typeName) {
		case z.ZodFirstPartyTypeKind.ZodDate:
			return result.replace(dateString).pipe(propertySchema) as T;

		// The ternaries are here to reduce the number of new object references
		case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion: {
			const updateType = fromDiscriminated(schema as ZodDiscriminated);

			return updateType === schema
				? false
				: (result.replace(updateType) as T);
		}
		case z.ZodFirstPartyTypeKind.ZodObject: {
			const updateType = fromObject(schema as ZodObject);

			return updateType === schema
				? false
				: (result.replace(updateType) as T);
		}
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
	const options = schema._def.options.map(
		option => [option, fromProperty(option)] as const,
	);

	if (options.every(([, updated]) => updated === false)) {
		// Nothing to change
		return schema;
	}

	return z.discriminatedUnion(
		schema.discriminator,
		options.map(([original, updated]) =>
			updated === false ? original : updated,
		) as never,
	) as unknown as T;
}

/** @internal */
type ZodDiscriminated = z.ZodDiscriminatedUnion<
	string,
	Array<z.ZodObject<z.ZodRawShape>>
>;
/** @internal */
type ZodObject = z.ZodObject<z.ZodRawShape>;
/** Zod Object schemas that can be made "JSON compatible */
export type ZodObjectForJson = ZodDiscriminated | ZodObject;

/**
 * Makes a given Zod schema compatible for JSON use.
 * It mainly focuses on allowing `z.date()` as date string
 * 	and then transform back to Date
 * 	so final parse and type are still the same
 *
 * @param schema to make "JSON-compatible"
 * @returns a new schema "JSON-compatible" or the given input if no change is needed
 */
export function zodObjectForJson<const T extends ZodObjectForJson>(
	schema: T,
): T {
	const schemaJSON = fromProperty(schema);
	return schemaJSON === false ? schema : (schemaJSON as T);
}
