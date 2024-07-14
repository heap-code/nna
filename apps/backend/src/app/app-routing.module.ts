import { Module } from "@nestjs/common";
import { Routes } from "@nestjs/core";
import { RouterModule } from "@nestjs/core";
import { extractModulesFromRoutes } from "@nna/nest";

import { AuthModule } from "./auth/auth.module";
import { GroupGenreModule } from "./group/genre/group-genre.module";
import { GroupModule } from "./group/group.module";
import { PersonModule } from "./person/person.module";
import { UserModule } from "./user/user.module";
import { HealthModule } from "../health";

/** @internal */
const APP_ROUTES: Routes = [
	{
		// FIXME: remove and use a regular module?
		module: HealthModule,
		path: "_health",
	},
];

/**
 * Modules that contains routes and modules with controllers
 *
 * Works as the modules that regroups all features,
 * 	but without the configuration (mail, logger, ...)
 */
@Module({
	imports: [
		...extractModulesFromRoutes(APP_ROUTES),
		AuthModule,
		GroupGenreModule,
		GroupModule,
		PersonModule,
		RouterModule.register(APP_ROUTES),
		UserModule,
	],
})
export class AppRoutingModule {}
