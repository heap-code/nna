import * as z from "zod";

import { PORT_MAX_VALUE, port } from "./port";

describe("Port", () => {
	describe("with regular number schema", () => {
		const base = z.number();
		const schemaNonZero = port(base);
		const schemaWithZero = port(base, { allowZero: true });

		it("should be valid", () => {
			for (const schema of [schemaNonZero, schemaWithZero]) {
				for (const i of [1, 10, 234, 8080, 55666, PORT_MAX_VALUE]) {
					expect(schema.parse(i)).toBe(i);
				}
			}

			expect(schemaWithZero.parse(0)).toBe(0);
		});

		it("should be invalid", () => {
			for (const schema of [schemaNonZero, schemaWithZero]) {
				for (const test of [PORT_MAX_VALUE + 1, "a", -1]) {
					expect(schema.safeParse(test).success).toBe(false);
				}
			}

			expect(schemaNonZero.safeParse(0).success).toBe(false);
		});
	});

	describe("with coerce number schema", () => {
		const base = z.coerce.number();
		const schemaNonZero = port(base);
		const schemaWithZero = port(base, { allowZero: true });

		it("should be valid", () => {
			for (const schema of [schemaNonZero, schemaWithZero]) {
				for (const i of [1, 10, 234, 8080, 55666, PORT_MAX_VALUE]) {
					expect(schema.parse(i)).toBe(i);
					expect(schema.parse(` ${i} `)).toBe(i);
				}
			}

			expect(schemaWithZero.parse(0)).toBe(0);
			expect(schemaWithZero.parse("0")).toBe(0);
		});
	});
});
