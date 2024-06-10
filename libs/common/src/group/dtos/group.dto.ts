import * as z from "zod";

/** Validation schema for {@link GroupDto} */
export const groupDtoSchema = z.object({});

export type GroupDto = z.infer<typeof groupDtoSchema>;
