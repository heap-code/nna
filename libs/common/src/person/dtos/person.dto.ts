import * as z from "zod";

/** Validation schema for {@link PersonDto} */
export const personDtoSchema = z.object({});

export type PersonDto = z.infer<typeof personDtoSchema>;
