import * as z from "zod";

import { groupDtoSchema } from "./group.dto";
import { personDtoSchema } from "../../person/dtos";

/** Extends {@link groupDtoSchema} with related dtos */
export const groupExtendedDtoSchema = groupDtoSchema.extend({
	persons: z.array(z.lazy(() => personDtoSchema)),
});
export type GroupExtendedDto = z.infer<typeof groupExtendedDtoSchema>;
