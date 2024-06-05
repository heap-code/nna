import { UserEntity } from "../../user/user.entity";
import { JWT } from "../jwt";

// To be used for authentication and permissions
/** This contains data and functions from Authenticated session */
export interface AuthSession {
	/** Get the connected user */
	getUser: () => Promise<UserEntity>;
	/** The payload that the session has been created from */
	readonly payload: JWT.Payload;
}
