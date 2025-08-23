import * as z from "zod";

/** Validation schema for {@link Dto} */
export const schema = z.object({
	expireOn: z.date().describe("Date the token will expire"),
	issuedAt: z.date().describe("Date the token have been issued"),
	token: z.string().describe("The auth token"),
});
/** Dto-response success of login */
export type Dto = z.infer<typeof schema>;
