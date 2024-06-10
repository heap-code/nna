import * as z from "zod";

/** Validation schema for {@link GroupUpdateDto} */
export const groupUpdateDtoSchema = z.object({});

/** Dto to update a group */
export type GroupUpdateDto = z.infer<typeof groupUpdateDtoSchema>;
