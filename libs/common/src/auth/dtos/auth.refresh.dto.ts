import * as z from "zod";

/** Validation schema for {@link Dto} */
export const schema = z
	.object({
		cookie: z
			.boolean()
			.default(false)
			.describe("Use a `HTTP only` cookie?")
			.optional(),
	})
	.strict();

export type Dto = z.infer<typeof schema>;
