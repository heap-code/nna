import { AuthLogin, AuthProfile, AuthRefresh, AuthSuccess } from ".";

describe("Auth DTOs", () => {
	const now = new Date();

	describe("AuthLogin", () => {
		type Dto = AuthLogin.Dto;
		const schema = AuthLogin.schema;

		it("should be valid", () => {
			for (const test of [
				{ password: "1234", username: "an username" },
				{ cookie: true, password: "1234", username: "an username" },
			] satisfies Dto[]) {
				expect(schema.parse(test)).toStrictEqual(test);
			}
		});
	});

	describe("AuthProfile", () => {
		type Dto = AuthProfile.Dto;
		const schema = AuthProfile.schema;

		it("should be valid", () => {
			for (const test of [
				{ expireOn: now, issuedAt: now },
			] satisfies Dto[]) {
				expect(schema.parse(test)).toStrictEqual(test);
			}
		});
	});

	describe("AuthRefresh", () => {
		type Dto = AuthRefresh.Dto;
		const schema = AuthRefresh.schema;

		it("should be valid", () => {
			for (const test of [
				{},
				{ cookie: false },
				{ cookie: true },
			] satisfies Dto[]) {
				expect(schema.parse(test)).toStrictEqual(test);
			}
		});
	});

	describe("AuthSuccess", () => {
		type Dto = AuthSuccess.Dto;
		const schema = AuthSuccess.schema;

		it("should be valid", () => {
			for (const test of [
				{ expireOn: now, issuedAt: now, token: "" },
			] satisfies Dto[]) {
				expect(schema.parse(test)).toStrictEqual(test);
			}
		});
	});
});
