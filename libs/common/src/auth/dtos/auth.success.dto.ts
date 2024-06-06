import * as z from "zod";

export const schema = z.object({
	expireOn: z.date().describe("Date the token will expire"),
	issuedAt: z.date().describe("Date the token have been issued"),
	token: z.string().describe("The Auth token"),
});

export type Dto = z.infer<typeof schema>;
