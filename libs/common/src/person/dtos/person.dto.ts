import * as z from "zod";

import { personModelSchema } from "../person.model";

/** Validation schema for {@link PersonDto} */
export const personDtoSchema = personModelSchema;

export type PersonDto = z.infer<typeof personDtoSchema>;
