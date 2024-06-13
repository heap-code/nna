import { Model } from "@nna/core";
import * as z from "zod";

import { groupModelSchema } from "../group";

const discriminator = "type";
const peopleType = z.discriminatedUnion(
	discriminator,
	[
		z.object({
			[discriminator]: z.literal("musician"),
			groupId: z.lazy(() =>
				groupModelSchema.shape._id
					.nullable()
					.describe("The current group this musician is playing"),
			),
			instrument: z.string().min(2),
		}),
		z.object({ [discriminator]: z.literal("listener") }),
	],
	{ description: "Type of people" },
);

export const personModelSchema = Model.schema.extend({
	name: z.string().describe("Name of the person").min(3),
	// TODO: only DTO?
	//peopleType,
});

export type PersonModel = z.infer<typeof personModelSchema>;
