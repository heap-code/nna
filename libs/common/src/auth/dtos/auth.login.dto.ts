import * as z from "zod";

export const authLoginSchema = z.object({
	password: z.string().describe("The password of the credentials"),
	username: z.string().describe("The username of the credentials"),

	cookie: z
		.boolean()
		.default(false)
		.describe("Use a `HTTP only` cookie?")
		.optional(),
});

export type AuthLoginDto = z.infer<typeof authLoginSchema>;
