import { Model } from "@nna/core";
import * as z from "zod";

export const groupSchema = Model.schema.extend({
	genreId: z
		.number({ description: "Foreign key for this group genre" })
		.min(0),
	name: z.string({ description: "Unique name of the group" }).min(3),
});

export type GroupModel = z.infer<typeof groupSchema>;
