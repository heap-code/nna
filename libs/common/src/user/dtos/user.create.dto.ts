import * as z from "zod";

/** Validation schema for {@link UserCreateDto} */
export const userCreateDtoSchema = z.object({});

/** Dto to create an user */
export type UserCreateDto = z.infer<typeof userCreateDtoSchema>;
