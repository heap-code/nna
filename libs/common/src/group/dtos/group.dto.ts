import * as z from "zod";

import { groupGenreDtoSchema } from "../genre/dtos";
import { groupModelSchema } from "../group.model";

/** Validation schema for {@link GroupDto} */
export const groupDtoSchema = groupModelSchema.extend({
	genre: groupGenreDtoSchema,
});
export type GroupDto = z.infer<typeof groupDtoSchema>;
