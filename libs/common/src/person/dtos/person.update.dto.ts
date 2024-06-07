import * as z from "zod";

/** Validation schema for {@link PersonUpdateDto} */
export const personUpdateDtoSchema = z.object({});

/** Dto to update a person */
export type PersonUpdateDto = z.infer<typeof personUpdateDtoSchema>;
