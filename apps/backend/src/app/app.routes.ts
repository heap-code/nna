import { Routes } from "@nestjs/core";
import { AUTH_HTTP_CONFIG } from "~/common/auth";

import { AuthModule } from "./auth/auth.module";
import { GroupModule } from "./group/group.module";
import { PersonModule } from "./person/person.module";
import { UserModule } from "./user/user.module";
import { HealthModule } from "../health";

export const APP_ROUTES: Routes = [
	{ module: HealthModule, path: "_health" },

	{ module: AuthModule, path: AUTH_HTTP_CONFIG.path },
	{ module: GroupModule, path: "groups" },
	{ module: PersonModule, path: "persons" },
	{ module: UserModule, path: "users" },
];
