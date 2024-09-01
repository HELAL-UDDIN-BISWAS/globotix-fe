describe("Dashboard", () => {
	beforeEach(() => {
		cy.visit("/login");
		cy.on("uncaught:exception", (err, runnable) => {
			return false;
		});
	});

	it("should successfully log in with valid credentials and display 4 cards, Bot Overview, Issue List, 2 charts, and Activity log", () => {
		const validEmail = "wendimaung@gmail.com";
		const validPassword = "User12345***";
		cy.get('input[name="email"]').type(validEmail);
		cy.get('input[name="password"]').type(validPassword);
		cy.get('button[type="submit"]').click();
		cy.wait(5000);
		cy.url().should("include", "/verification");
		cy.wait(20000);
		cy.url().should("include", "/dashboard");
		cy.get(".grid-cols-2.lg\\:grid-cols-4").children().should("have.length", 4);
		cy.contains("Bot Overview").should("be.visible");
		cy.contains("Active").should("be.visible");
		cy.contains("Idle").should("be.visible");
		cy.contains("Issues").should("be.visible");
		cy.get("canvas").should("be.visible");
		cy.get("canvas").should("have.length", 2);
		cy.contains("Activity Log").should("be.visible");
		cy.contains("Bot Overview").parent().contains("View All").click();
		cy.wait(15000);
		cy.url().should("include", "/robots");
	});
});
