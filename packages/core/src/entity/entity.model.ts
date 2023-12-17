import * as z from "zod";

export const entitySchema = z.object({
	_id: z
		.number({ description: "Unique ID defining an entity" })
		.min(0)
		.readonly(),
	create_at: z
		.date({ description: "The date when this entity has been created" })
		.readonly(),
	update_at: z
		.date({ description: "The date when this entity has been updated" })
		.readonly(),
});

export type EntityModel = z.infer<typeof entitySchema>;
