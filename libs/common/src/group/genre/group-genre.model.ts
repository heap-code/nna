import { ModelString } from "@nna/core";
import * as z from "zod";

/** Validation schema for {@link GroupGenreModel} */
export const groupGenreSchema = ModelString.schema.extend({
	name: z
		.string()
		.meta({ description: "Unique name of the group genre" })
		.min(2),
});

export type GroupGenreModel = z.infer<typeof groupGenreSchema>;
