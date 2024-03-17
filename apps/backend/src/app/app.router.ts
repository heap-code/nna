import { RouterModule } from "@nestjs/core";

import { GroupModule } from "./group/group.module";
import { PersonModule } from "./person/person.module";
import { UserModule } from "./user/user.module";

export const APP_ROUTER = RouterModule.register([
	{ module: GroupModule, path: "groups" },
	{ module: PersonModule, path: "person" },
	{ module: UserModule, path: "users" },
]);
