import { createQueryObjectSchema } from "@nna/core";
import * as z from "zod";

import { userDtoSchema } from "./user.dto";

/** Validation schema for {@link UserQueryDto} */
export const userQueryDtoSchema = createQueryObjectSchema(userDtoSchema, {
	coerce: true,
	strict: true,
}).strict();

/** DTO used to filter users */
export type UserQueryDto = z.infer<typeof userQueryDtoSchema>;
