import { entitySchema } from "@nna/core";
import * as z from "zod";

export const userSchema = entitySchema.extend({
	email: z.string({ description: "Email of the user" }).email(),
});

export type UserModel = z.infer<typeof userSchema>;
