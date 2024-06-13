import { Schemas, createQueryObjectSchema } from "@nna/core";
import * as z from "zod";

import { personDtoSchema } from "./person.dto";
import { groupDtoSchema } from "../../group";

/** Extends {@link personDtoSchema} with related dtos */
export const personDtoExtendedSchema = personDtoSchema.extend({
	groups: z.array(z.lazy(() => groupDtoSchema)),
});
export type PersonDtoExtended = z.infer<typeof personDtoExtendedSchema>;

/** Validation schema for {@link PersonQueryDto} */
export const personQueryDtoSchema = createQueryObjectSchema(
	Schemas.objectForJson(personDtoExtendedSchema),
	{ coerce: true, strict: true },
);

/** DTO used to filter persons */
export type PersonQueryDto = z.infer<typeof personQueryDtoSchema>;
