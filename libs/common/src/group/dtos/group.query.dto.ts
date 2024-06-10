import * as z from "zod";

/** Validation schema for {@link GroupQueryDto} */
export const groupQueryDtoSchema = z.object({});

/** DTO used to filter groups */
export type GroupQueryDto = z.infer<typeof groupQueryDtoSchema>;
