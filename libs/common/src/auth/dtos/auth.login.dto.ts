import * as z from "zod";

import { schema as refreshSchema } from "./auth.refresh.dto";

/** Validation schema for {@link Dto} */
export const schema = refreshSchema.extend({
	password: z.string().describe("The password of the credentials"),
	username: z.string().describe("The username of the credentials"),
});
/** Dto for the login of an user */
export type Dto = z.infer<typeof schema>;
