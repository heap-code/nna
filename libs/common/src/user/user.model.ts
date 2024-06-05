import { Model } from "@nna/core";
import * as z from "zod";

export const userSchema = Model.schema.extend({
	username: z.string({ description: "Identifier of the user" }),
});

export type UserModel = z.infer<typeof userSchema>;
