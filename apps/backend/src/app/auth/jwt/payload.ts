import { type ModelPrimaryKey } from "@nna/core";

import { PayloadSource } from "./source";
import { type UserEntity } from "../../user/user.entity";

/**
 * Decoded data inside a JWT (or to encoded to a JWT).
 * The data is "raw" and then can be hydrated on use
 */
export interface Payload {
	/** What is/was the method/source used to connect (and some additional infos) */
	source: PayloadSource;
	/** Id of the user connected */
	userId: UserEntity[ModelPrimaryKey];
	/**
	 * The application version when the user logged in.
	 * It can be used to auto-logout users on updates.
	 */
	version: string;
}

export * from "./source";
