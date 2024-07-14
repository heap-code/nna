// The handlebar precompile has not been set to false
//	to avoid 500 errors on prod environments (happens in dev) & it can not be set with jest,
//	so these tests are one of the ways to ensure correct typing and templating

import { faker } from "@faker-js/faker";

import { render } from "./demo.template";

describe("Template demo", () => {
	it("should render", () => {
		for (let i = 0; i < 10; ++i) {
			const name = faker.person.firstName();
			const age = faker.helpers.rangeToNumber({ max: 100, min: 2 });

			const template = render({ user: { age, name } });
			expect(template).toContain(`<style>`);
			expect(template).toContain(`Hello ${name}`);
			expect(template).toContain(
				`<span>You are now ${age} years old</span>`,
			);
		}
	});
});
