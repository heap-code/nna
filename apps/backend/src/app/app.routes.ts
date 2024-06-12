import { Routes } from "@nestjs/core";
import { AUTH_HTTP_CONFIG } from "~/common/auth";
import { GROUP_HTTP_CONFIG } from "~/common/group";
import { GROUP_GENRE_HTTP_CONFIG } from "~/common/group/genre";
import { PERSON_HTTP_CONFIG } from "~/common/person";
import { USER_HTTP_CONFIG } from "~/common/user";

import { AuthModule } from "./auth/auth.module";
import { GroupGenreModule } from "./group/genre/group-genre.module";
import { GroupModule } from "./group/group.module";
import { PersonModule } from "./person/person.module";
import { UserModule } from "./user/user.module";
import { HealthModule } from "../health";

export const APP_ROUTES: Routes = [
	{ module: HealthModule, path: "_health" },

	{ module: AuthModule, path: AUTH_HTTP_CONFIG.entrypoint },
	{ module: GroupGenreModule, path: GROUP_GENRE_HTTP_CONFIG.entrypoint },
	{ module: GroupModule, path: GROUP_HTTP_CONFIG.entrypoint },
	{ module: PersonModule, path: PERSON_HTTP_CONFIG.entrypoint },
	{ module: UserModule, path: USER_HTTP_CONFIG.entrypoint },
];
