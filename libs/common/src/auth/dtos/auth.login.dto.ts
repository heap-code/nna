import * as z from "zod";

import { authRefreshSchema } from "./auth.refresh.dto";

export const authLoginSchema = authRefreshSchema.extend({
	password: z.string().describe("The password of the credentials"),
	username: z.string().describe("The username of the credentials"),
});

export type AuthLoginDto = z.infer<typeof authLoginSchema>;
