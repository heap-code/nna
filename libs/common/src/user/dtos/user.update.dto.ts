import * as z from "zod";

/** Validation schema for {@link UserUpdateDto} */
export const userUpdateDtoSchema = z.object({});

/** Dto to update an user */
export type UserUpdateDto = z.infer<typeof userUpdateDtoSchema>;
