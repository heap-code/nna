import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import * as z from "zod";

/**
 * Creates a class usable with NestJS and {@link ZodValidationPipe}
 *
 * @param schema to create the class from
 * @returns A class usable with NestJS Validation Pipe
 */
export function createValidationClass<T extends z.ZodTypeAny>(schema: T) {
	return createZodDto(extendApi(schema));
}

// TODO
export { ZodValidationPipe as AppValidationPipe } from "@anatine/zod-nestjs";
