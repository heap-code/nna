import { ORM_DEFAULT_CONFIGURATION } from "./orm.default-config";

describe("ORM_DEFAULT_CONFIGURATION", () => {
	const {
		migrations,
		namingStrategy: NamingStrategy,
		seeder,
	} = ORM_DEFAULT_CONFIGURATION;

	it("should transform `ClassName` to `TableName` correctly", () => {
		const naming = new NamingStrategy();

		for (const [test, expected] of [
			["user", "user"],
			["GroupEntity", "group"],
			["UserGroup", "user_group"],
		] satisfies Array<[string, string]>) {
			expect(naming.classToTableName(test)).toBe(expected);
		}
	});

	it("should get migration filename", () => {
		const fn = migrations.fileName;

		expect(fn("01")).toBe("01.migration");
		expect(fn("02", "name")).toBe("02.name.migration");
		expect(fn("03", "InitDb")).toBe("03.init-db.migration");
	});

	it("should get seeder filename", () => {
		const fn = seeder.fileName;

		expect(fn("name")).toBe("name.seeder");
		expect(fn("FullDb")).toBe("full-db.seeder");
		expect(fn("emptySeeder")).toBe("empty.seeder");
	});
});
