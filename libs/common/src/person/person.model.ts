import { Model } from "@nna/core";
import * as z from "zod";

const discriminator = "type";
const peopleType = z.discriminatedUnion(
	discriminator,
	[
		z.object({
			[discriminator]: z.literal("musician"),
			groupId: z.number().min(1).nullable(),
			instrument: z
				.string()
				.min(2)
				.describe("The current group this musician is playing"),
		}),
		z.object({ [discriminator]: z.literal("listener") }),
	],
	{ description: "Type of people" },
);

export const personSchema = Model.schema.extend({
	name: z.string().describe("Name of the person").min(3),
	peopleType,
});

export type PersonModel = z.infer<typeof personSchema>;
