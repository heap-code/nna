import { Model } from "@nna/core";
import * as z from "zod";

export const userModelSchema = Model.schema.extend({
	username: z.string().describe("Identifier of the user"),
});

export type UserModel = z.infer<typeof userModelSchema>;
