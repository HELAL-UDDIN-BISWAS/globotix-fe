
describe('Schedule page view', () => {
  // =-=-=-==-=-You are login email and password-=-=-=-=-=-
  const validEmail = "mdhelalu047@gmail.com";
  const validPassword = "12345678";

  beforeEach(() => {
    cy.visit("/login");
    cy.on("uncaught:exception", () => false);
    cy.login(validEmail, validPassword);
    cy.url().should('not.include', '/login', { timeout: 20000 });
    cy.visit('/schedule');
    // cy.url().should('include', '/schedule');
  });

  it('should interact with calendar functionalities', () => {


    cy.get('.flex-1.min-h-\\[180px\\]').first().click()
      .should('not.have.class', 'bg-primary');

    // Test filter functionality
    cy.contains('button', 'Filter').click();
    cy.get('.modal, .dropdown, [role="dialog"]').within(() => {
      cy.get('input[placeholder="Search Organization"]').type('test');
      cy.wait(1000)
      cy.contains(/Apply|filter|search/i).click();
    });
    cy.wait(1000)

    // Reset filters
    cy.contains('Reset').click({ force: true });
    cy.wait(1000)

    // Test menu functionality
    cy.get('button[aria-haspopup="menu"]').find('svg').last().as('menuButton')
      .click();
    cy.contains('span', 'View').click();
    cy.wait(1000)

    // Close modal
    cy.get('div.flex.items-end.justify-end.cursor-pointer')
      .find('svg[viewBox="0 0 15 15"]')
      .parent()
      .click();
    cy.wait(1000)

    // Re-open menu
    cy.get('@menuButton').click();
    cy.wait(1000)
    cy.contains('span', 'Delete').click();
    cy.wait(1000)
  });
});

// Add this to your commands.js file
Cypress.Commands.add('login', (email, password) => {
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().then(url => cy.log(`URL after login attempt: ${url}`));
  cy.wait(20000)
  cy.url().then(url => cy.log(`URL after login: ${url}`));
  cy.wait(10000);
  cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
  cy.wait(10000);
});