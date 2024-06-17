import * as z from "zod";

import { userModelSchema } from "../user.model";

/** Validation schema for {@link UserCreateDto} */
export const userCreateDtoSchema = userModelSchema.pick({}).partial().strict();

/** Dto to create an user */
export type UserCreateDto = z.infer<typeof userCreateDtoSchema>;
