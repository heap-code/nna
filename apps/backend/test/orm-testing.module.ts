import { OrmModule } from "../src/orm/orm.module";

// TODO

export const OrmTestingModule = OrmModule.forRoot({
	allowGlobalContext: true,
	dbName: "db-test",
	host: "db",
	password: "PASSWORD",
	user: "user",
});
