import { Schemas, createQueryObjectSchema } from "@nna/core";
import * as z from "zod";

import { groupDtoSchema } from "./group.dto";
import { personDtoSchema } from "../../person";

/** Extends {@link groupDtoSchema} with related dtos */
export const groupDtoExtendedSchema = groupDtoSchema.extend({
	persons: z.array(z.lazy(() => personDtoSchema)),
});
export type GroupDtoExtended = z.infer<typeof groupDtoExtendedSchema>;

/** Validation schema for {@link GroupQueryDto} */
export const groupQueryDtoSchema = createQueryObjectSchema(
	Schemas.objectForJson(groupDtoExtendedSchema),
	{ coerce: true, strict: true },
);

/** DTO used to filter groups */
export type GroupQueryDto = z.infer<typeof groupQueryDtoSchema>;
