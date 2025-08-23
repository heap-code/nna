import * as z from "zod";

/** Validation schema for {@link Dto} */
export const schema = z
	.object({
		cookie: z.boolean().describe("Use a `HTTP only` cookie?").optional(),
	})
	.strict();
/** Dto for a the refresh of authed session */
export type Dto = z.infer<typeof schema>;
