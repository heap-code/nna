import { createQueryFilterSchema } from "@nna/core";
import * as z from "zod";

import { userDtoSchema } from "./user.dto";

/** Validation schema for {@link UserQueryDto} */
export const userQueryDtoSchema = createQueryFilterSchema(userDtoSchema, {
	coerce: true,
});

/** DTO used to filter users */
export type UserQueryDto = z.infer<typeof userQueryDtoSchema>;
