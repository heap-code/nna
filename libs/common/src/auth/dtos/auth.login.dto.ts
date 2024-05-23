import * as z from "zod";

export const authLoginSchema = z.object({
	password: z.string({ description: "Woo" }),
	username: z.string({ description: "" }),

	c: z.boolean().optional(),
});

export type AuthLoginDto = z.infer<typeof authLoginSchema>;
