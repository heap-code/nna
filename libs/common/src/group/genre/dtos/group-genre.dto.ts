import * as z from "zod";

import { groupGenreSchema } from "../group-genre.model";

/** Validation schema for {@link GroupGenreDto} */
export const groupGenreDtoSchema = groupGenreSchema;

export type GroupGenreDto = z.infer<typeof groupGenreDtoSchema>;
