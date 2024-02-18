import * as z from "zod";

/** Base-base schema for `Model` */
export const schemaBase = z.object({
	createdAt: z
		.date({ description: "The date when this entity has been created" })
		.readonly(),
	updatedAt: z
		.date({ description: "The date when this entity has been updated" })
		.readonly(),
});
