import * as z from "zod";

export const schema = z.object({
	cookie: z
		.boolean()
		.default(false)
		.describe("Use a `HTTP only` cookie?")
		.optional(),
});

export type Dto = z.infer<typeof schema>;
