import * as z from "zod";

import { userModelSchema } from "../user.model";

// TODO

/** Validation schema for {@link UserDto} */
export const userDtoSchema = userModelSchema.pick({ _id: true });

export type UserDto = z.infer<typeof userDtoSchema>;
