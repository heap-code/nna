import { Model } from "@nna/core";
import * as z from "zod";

const abc = "abc" as const;
const a = z.discriminatedUnion(
	abc,
	[
		z.object({ [abc]: z.literal("musician"), b: z.number() }),
		z.object({ [abc]: z.literal("listener") }),
	],
	{ description: "lkjhg" },
);

export const personSchema = Model.schema.extend({
	a,
	name: z.string({ description: "Name of the person" }).min(3),
});

export type PersonModel = z.infer<typeof personSchema>;
