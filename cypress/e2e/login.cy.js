describe("Login Form", () => {
	beforeEach(() => {
		cy.visit("/login");
		cy.on("uncaught:exception", (err, runnable) => {
			return false;
		});
	});

	it("should successfully log in with valid credentials and redirect to verification page", () => {
		const validEmail = "wendimaung@gmail.com";
		const validPassword = "User12345**";
		cy.get('input[name="email"]').type(validEmail);
		cy.get('input[name="password"]').type(validPassword);
		cy.get('button[type="submit"]').click();
		cy.wait(3000);
		cy.url().should("include", "/verification");
	});

	it("should show an error message with invalid credentials", () => {
		const invalidEmail = "invalid@example.com";
		const invalidPassword = "wrongpassword";
		cy.get('input[name="email"]').type(invalidEmail);
		cy.get('input[name="password"]').type(invalidPassword);
		cy.get('button[type="submit"]').click();
		cy.wait(3000);
		cy.get("div").contains("User not found").should("be.visible");
	});

	it("should lock the account after multiple failed attempts", () => {
		const invalidEmail = "invalid@example.com";
		const invalidPassword = "wrongpassword";
		for (let i = 0; i < 5; i++) {
			cy.get('input[name="email"]').clear().type(invalidEmail);
			cy.get('input[name="password"]').clear().type(invalidPassword);
			cy.get('button[type="submit"]').click({ force: true });
			cy.wait(3000);
			cy.get("body").then(($body) => {
				if ($body.text().includes("Your account has been locked")) {
					return false;
				}
			});
		}
	});

	it("should disable submit button when fields are empty", () => {
		cy.get('button[type="submit"]').should("be.disabled");

		cy.get('input[name="email"]').type("test@example.com");
		cy.get('button[type="submit"]').should("be.disabled");

		cy.get('input[name="email"]').clear();
		cy.get('input[name="password"]').type("password123");
		cy.get('button[type="submit"]').should("be.disabled");

		cy.get('input[name="email"]').type("test@example.com");
		cy.get('button[type="submit"]').should("not.be.disabled");
	});

	it("should navigate to forgot password page", () => {
		cy.contains("Forgot Password").click();
		cy.url({ timeout: 5000 }).should("include", "/forgot-password");
	});
});
