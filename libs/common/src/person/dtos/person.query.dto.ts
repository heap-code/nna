import { Schemas, createQueryObjectSchema } from "@nna/core";
import * as z from "zod";

import { personExtendedDtoSchema } from "./person.extended.dto";

/** Validation schema for {@link PersonQueryDto} */
export const personQueryDtoSchema = createQueryObjectSchema(
	Schemas.objectForJson(personExtendedDtoSchema),
	{ coerce: true, strict: true },
);

/** DTO used to filter persons */
export type PersonQueryDto = z.infer<typeof personQueryDtoSchema>;
