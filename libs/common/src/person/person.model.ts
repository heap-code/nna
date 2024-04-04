import { Model } from "@nna/core";
import * as z from "zod";

const discriminator = "type";
const peopleType = z.discriminatedUnion(
	discriminator,
	[
		z.object({
			[discriminator]: z.literal("musician"),
			instrument: z.string().min(2),
		}),
		z.object({ [discriminator]: z.literal("listener") }),
	],
	{ description: "Type of people" },
);

export const personSchema = Model.schema.extend({
	name: z.string({ description: "Name of the person" }).min(3),
	peopleType,
});

export type PersonModel = z.infer<typeof personSchema>;
