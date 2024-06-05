import * as z from "zod";

export const authRefreshSchema = z.object({
	cookie: z
		.boolean()
		.default(false)
		.describe("Use a `HTTP only` cookie?")
		.optional(),
});

export type AuthRefreshDto = z.infer<typeof authRefreshSchema>;
