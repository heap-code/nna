import * as z from "zod";

/** Base schema for `Model` */
export const schema = z.object({
	_id: z
		.number({ description: "Unique ID defining an entity" })
		.min(0)
		.readonly(),
	createdAt: z
		.date({ description: "The date when this entity has been created" })
		.readonly(),
	updatedAt: z
		.date({ description: "The date when this entity has been updated" })
		.readonly(),
});

/** Extracted type from the `Model` [schema]{@link schema} */
export type Type = z.infer<typeof schema>;
