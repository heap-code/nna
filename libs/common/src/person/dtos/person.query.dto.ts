import * as z from "zod";

/** Validation schema for {@link PersonQueryDto} */
export const personQueryDtoSchema = z.object({});

/** DTO used to filter persons */
export type PersonQueryDto = z.infer<typeof personQueryDtoSchema>;
