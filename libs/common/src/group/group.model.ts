import { Model } from "@nna/core";
import * as z from "zod";

import { groupGenreSchema } from "./genre";

/** Validation schema for {@link GroupModel} */
export const groupModelSchema = Model.schema.extend({
	genreId: groupGenreSchema.shape._id,
	name: z.string().meta({ description: "Unique name of the group" }).min(3),
});

export type GroupModel = z.infer<typeof groupModelSchema>;
