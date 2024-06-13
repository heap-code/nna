import { createPayload } from "@nna/nest";
import {
	AuthLogin,
	AuthProfile,
	AuthRefresh,
	AuthSuccess,
} from "~/common/auth";

// Can create one file for each class

/** Validation class for {@link AuthLogin} */
export class AuthLoginPayload
	extends createPayload(AuthLogin.schema)
	implements AuthLogin.Dto {}

/** Validation class for {@link AuthProfile} */
export class AuthProfilePayload
	extends createPayload(AuthProfile.schema)
	implements AuthProfile.Dto {}

/** Validation class for {@link AuthRefresh} */
export class AuthRefreshPayload
	extends createPayload(AuthRefresh.schema)
	implements AuthRefresh.Dto {}

/** Validation class for {@link AuthSuccess} */
export class AuthSuccessPayload
	extends createPayload(AuthSuccess.schema)
	implements AuthSuccess.Dto {}
