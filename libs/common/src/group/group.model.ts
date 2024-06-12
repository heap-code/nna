import { Model } from "@nna/core";
import * as z from "zod";

import { groupGenreSchema } from "./genre";

export const groupModelSchema = Model.schema.extend({
	genreId: groupGenreSchema.pick({ _id: true }).shape._id,
	name: z.string({ description: "Unique name of the group" }).min(3),
});

export type GroupModel = z.infer<typeof groupModelSchema>;
