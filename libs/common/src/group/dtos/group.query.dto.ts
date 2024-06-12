import { Schemas, createQueryObjectSchema } from "@nna/core";
import * as z from "zod";

import { groupDtoSchema } from "./group.dto";

/** Validation schema for {@link GroupQueryDto} */
export const groupQueryDtoSchema = createQueryObjectSchema(
	Schemas.objectForJson(groupDtoSchema),
	{ coerce: true, strict: true },
);

/** DTO used to filter groups */
export type GroupQueryDto = z.infer<typeof groupQueryDtoSchema>;
