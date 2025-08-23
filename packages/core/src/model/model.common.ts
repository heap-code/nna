import * as z from "zod";

/** Base-base schema for `Model` */
export const schemaCommon = z.object({
	createdAt: z
		.date()
		.meta({ description: "The date when this entity has been created" })
		.readonly(),
	updatedAt: z
		.date()
		.meta({ description: "The date when this entity has been updated" })
		.readonly(),
});

/** Field of the primary key for the models */
export const PRIMARY_KEY = "_id";
