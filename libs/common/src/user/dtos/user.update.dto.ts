import * as z from "zod";

import { userCreateDtoSchema } from "./user.create.dto";

/** Validation schema for {@link UserUpdateDto} */
export const userUpdateDtoSchema = userCreateDtoSchema
	.pick({})
	.partial()
	.strict();

/** Dto to update an user */
export type UserUpdateDto = z.infer<typeof userUpdateDtoSchema>;
