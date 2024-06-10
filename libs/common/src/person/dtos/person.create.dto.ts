import * as z from "zod";

/** Validation schema for {@link PersonCreateDto} */
export const personCreateDtoSchema = z.object({});

/** Dto to create a person */
export type PersonCreateDto = z.infer<typeof personCreateDtoSchema>;
