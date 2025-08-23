import { createZodDto } from "nestjs-zod";
import * as z from "zod";

/**
 * Creates a class usable with NestJS and {@link ZodValidationPipe}
 *
 * @param schema to create the class from
 * @returns A class usable with the {@link PayloadValidationPipe}
 */
export function createPayload<T extends z.ZodType>(schema: T) {
	// FIXME: https://github.com/BenLorantfy/nestjs-zod/issues/184
	const apiSchema = z.toJSONSchema(schema, {
		override: ({ jsonSchema, zodSchema }) => {
			if (zodSchema._zod.def.type === "date") {
				jsonSchema.type = "string";
				jsonSchema.format = "date-time";
			}
		},
		unrepresentable: "any",
	});

	schema._zod.toJSONSchema = () => apiSchema;
	return createZodDto(schema);
}

// The validation pipe to use
export { ZodValidationPipe as PayloadValidationPipe } from "nestjs-zod";
