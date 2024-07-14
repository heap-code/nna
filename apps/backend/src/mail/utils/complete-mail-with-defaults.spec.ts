import { completeMailWithDefaults } from "./complete-mail-with-defaults";

describe("Mail-utils `completeMailWithDefaults`", () => {
	const sender = "email@test.host";

	it("should get default values", () => {
		const mail = completeMailWithDefaults(
			{ html: "<h1>Hello</h1>" },
			{ actors: { sender }, transport: {} },
		);

		expect(mail.from).toBe(sender);
		expect(mail.text).toBeDefined();
	});

	it("should not override mail", () => {
		const text = "Some text";
		const sender2 = "email2@test.host";

		const mail = completeMailWithDefaults(
			{ from: sender2, html: "<h1>Hello</h1>", text },
			{ actors: { sender }, transport: {} },
		);

		expect(mail.from).not.toBe(sender);
		expect(mail.from).toBe(sender2);
		expect(mail.text).toBe(text);
	});
});
