import * as z from "zod";

import { personDtoSchema } from "./person.dto";
import { groupDtoSchema } from "../../group/dtos";

/** Extends {@link personDtoSchema} with related dtos */
export const personExtendedDtoSchema = personDtoSchema.extend({
	groups: z.array(z.lazy(() => groupDtoSchema)),
});
export type PersonExtendedDto = z.infer<typeof personExtendedDtoSchema>;
