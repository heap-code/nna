import * as z from "zod";

/** Validation schema for {@link UserDto} */
export const userDtoSchema = z.object({});

export type UserDto = z.infer<typeof userDtoSchema>;
