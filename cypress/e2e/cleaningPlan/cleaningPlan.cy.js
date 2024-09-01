describe('CleaningPlanView', () => {
  beforeEach(() => {
    cy.visit('/login'); // Assume we have a custom command for login
    //   cy.visit('/cleaning-plan');
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.intercept('GET', '**/api/cleaning-plan*').as('getCleaningPlans');
  });

  it('should display and interact with the Cleaning Plan page', () => {
    const validEmail = "jonsofi8288@gmail.com";
    const validPassword = "12345678";
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    cy.url().then(url => cy.log(`URL after login attempt: ${url}`));
    cy.wait(20000)
    cy.url().then(url => cy.log(`URL after login: ${url}`));
    cy.wait(10000);
    cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
    cy.wait(10000);

    cy.visit('/cleaning-plan')
    cy.wait(10000);
    // Check if the page title is correct      cy.get('h1').should('contain', 'Cleaning Plan');

    // Verify search input exists and is functional
    cy.get('input[type="text"][placeholder="Search Cleaning Plan"]')
      .should('exist')
      .type('Test Plan');
    // cy.wait('@getCleaningPlans');

    // Check if filter button exists and opens modal
    cy.get('div').contains('Filter').click();
    // cy.get('.modal').should('be.visible');
    cy.contains(/apply|filter|search/i).click();


    // Verify reset functionality
    cy.contains('Reset').click();
    // cy.wait('@getCleaningPlans');

    // Check if "New Cleaning Plan" button exists for admin users
    cy.get('a').contains('+ New Cleaning Plan').should('exist');

    // Verify table exists and contains data
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length.at.least', 1);

    // Test pagination
    cy.get('[aria-label="Pagination"]').should('exist');
    // cy.get('[aria-label="Pagination"] button').eq(1).click();



    // Select multiple items
    cy.get('input[type="radio"]').last().click();
    cy.wait(1000)
    cy.get('[data-testid="button-icon-delete-selected"]').click({ force: true });
    cy.contains("span", 'Confirm').click();
cy.wait(2000)
cy.contains('Reset').click();

    // Test view functionality
    cy.wait(7000)
    cy.get('tbody tr')
      .first()
      .find('button, [role="button"]')
      .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
      .click();
    cy.contains('span', 'View').click();

    // Go back to the list view
    cy.go('back');
  });


});