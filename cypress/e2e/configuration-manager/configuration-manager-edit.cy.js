describe("configuration-manager-edit", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });

  it("should successfully log in with valid credentials and redirect to configuration-manager-edit page", () => {
    const validEmail = "alaminice1617@gmail.com";
    const validPassword = "12345678";
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.url().should("include", "/verification");
    cy.wait(20000);
    cy.visit("/configuration-manager/edit");

    cy.contains("Configuration Details").should("be.visible");

    cy.contains("Try Times").should("be.visible");

    cy.contains("Suspending Times").should("be.visible");
  });
});
