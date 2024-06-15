import { MigrationObject } from "@mikro-orm/core";
import { Migration } from "@mikro-orm/core/typings";

import { NotUniqueMessage, areMigrationsUnique } from "./are-migrations-unique";

describe("areMigrationsUnique", () => {
	class DummyMigration implements Migration {
		public up() {
			return Promise.resolve();
		}
		public down() {
			return this.up();
		}
	}

	it("should validate that the migration names are unique", () => {
		for (const migrations of [
			[],
			[{ class: DummyMigration, name: "a" }],
			[
				{ class: DummyMigration, name: "a" },
				{ class: DummyMigration, name: "b" },
			],
		] satisfies MigrationObject[][]) {
			expect(areMigrationsUnique(migrations)).toStrictEqual(migrations);
		}
	});

	it("should invalidate migration uniqueness", () => {
		const duplicate = "_a_";

		for (const migrations of [
			[
				{ class: DummyMigration, name: duplicate },
				{ class: DummyMigration, name: duplicate },
			],
			[
				{ class: DummyMigration, name: duplicate },
				{ class: DummyMigration, name: "ok" },
				{ class: DummyMigration, name: duplicate },
			],
			[
				{ class: DummyMigration, name: "ok1" },
				{ class: DummyMigration, name: duplicate },
				{ class: DummyMigration, name: "ok2" },
				{ class: DummyMigration, name: duplicate },
				{ class: DummyMigration, name: "ok3" },
			],
		] satisfies MigrationObject[][]) {
			expect(areMigrationsUnique(migrations)).toContain(duplicate);
		}
	});

	describe("With typechecking", () => {
		it("should be valid", () => {
			const migrations = [
				{ class: DummyMigration, name: "abc" },
				{ class: DummyMigration, name: "def" },
				{ class: DummyMigration, name: "ghi" },
			] as const satisfies MigrationObject[];

			const result = areMigrationsUnique(migrations);

			const ok: readonly MigrationObject[] = result;
			// @ts-expect-error -- should be types as above
			const ko: NotUniqueMessage<string> = result;

			expect(Array.isArray(ok)).toBe(true);
			expect(typeof ko === "string").toBe(false);
		});

		it("should be invalid", () => {
			const migrations = [
				{ class: DummyMigration, name: "abc" },
				{ class: DummyMigration, name: "def" },
				{ class: DummyMigration, name: "abc" },
			] as const satisfies MigrationObject[];

			const result = areMigrationsUnique(migrations);

			// @ts-expect-error -- should be types as string
			const ok: readonly MigrationObject[] = result;
			const ko: NotUniqueMessage<"abc"> = result;
			// @ts-expect-error -- Not the correct name
			const ko2: NotUniqueMessage<"def"> = result;

			expect(Array.isArray(ok)).toBe(false);
			expect(typeof ko === "string").toBe(true);
			expect(typeof ko2 === "string").toBe(true);
		});
	});
});
