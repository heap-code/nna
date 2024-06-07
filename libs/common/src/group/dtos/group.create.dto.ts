import * as z from "zod";

/** Validation schema for {@link GroupCreateDto} */
export const groupCreateDtoSchema = z.object({});

/** Dto to create a group */
export type GroupCreateDto = z.infer<typeof groupCreateDtoSchema>;
