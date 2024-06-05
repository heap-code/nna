import { type ModelPrimaryKey } from "@nna/core";
import * as z from "zod";

import { payloadSourceSchema } from "./source";
import { type UserEntity } from "../../user/user.entity";

/** Schema for {@link Payload} */
export const payloadSchema = z.object({
	/** What is/was the method/source used to connect (and some additional infos) */
	source: payloadSourceSchema,
	/** Id of the user connected */
	userId: z.number().min(1) satisfies z.ZodType<UserEntity[ModelPrimaryKey]>,
	/**
	 * The application version when the user logged in.
	 * It can be used to auto-logout users on updates.
	 */
	version: z.string(),
});

/**
 * Decoded data inside a JWT (or to encoded to a JWT).
 * The data is "raw" and then can be hydrated for an {@link AuthSession}
 */

export type Payload = z.infer<typeof payloadSchema>;

export * from "./source";
