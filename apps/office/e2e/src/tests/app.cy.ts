describe("office-e2e", () => {
	let seed: Cypress.ExtractFromChainable<ReturnType<typeof refreshDb>>;
	const refreshDb = () => cy.refreshDb({ seed: "empty" });

	beforeEach(() => {
		cy.visit("/");
		refreshDb().then(data => (seed = data));
	});

	it("should seed", () => {
		expect(seed.users).to.have.length(1);
	});

	it("should login", () => {
		cy.loginWith(seed.users[0]);
	});
});
