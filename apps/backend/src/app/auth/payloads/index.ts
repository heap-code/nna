import { createPayload } from "@nna/nest";
import {
	AuthLogin,
	AuthProfile,
	AuthRefresh,
	AuthSuccess,
} from "~/common/auth/dtos";

// Can create one file for each class

export class AuthLoginPayload
	extends createPayload(AuthLogin.schema)
	implements AuthLogin.Dto {}

export class AuthProfilePayload
	extends createPayload(AuthProfile.schema)
	implements AuthProfile.Dto {}

export class AuthRefreshPayload
	extends createPayload(AuthRefresh.schema)
	implements AuthRefresh.Dto {}

export class AuthSuccessPayload
	extends createPayload(AuthSuccess.schema)
	implements AuthSuccess.Dto {}
