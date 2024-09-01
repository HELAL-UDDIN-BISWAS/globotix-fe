describe('Reports Page', () => {
  const validEmail = "jonsofi8288@gmail.com";
  const validPassword = "12345678";

  beforeEach(() => {
    cy.visit("/login");
    cy.on("uncaught:exception", () => false);
    
    // Custom command for login
    cy.login(validEmail, validPassword);

    // Wait for login and redirect
    cy.url().should('include', '/dashboard', { timeout: 60000 });
    
    // Navigate to Reports page
    cy.visit('/reports');
    
    // Intercept API calls
    cy.intercept('GET', '**/api/reports**').as('fetchReports');
  });

  it('interacts with Reports page elements', () => {
    // Check page title
    // cy.contains('h1', 'Reports', { timeout: 10000 }).should('be.visible');

    // Interact with search input
    cy.get('input[name="search"]')
      .should('be.visible')
      .type('Test Building');
    // cy.wait('@fetchReports');

    // Interact with date range inputs
    cy.contains('span', 'From Date').click();
    cy.contains('div','5').click({force:true})

    // Open filter modal and interact
  //   cy.contains('button', 'Filter').click();
  //   cy.get('span.text-primary.font-semibold')
  //     .should('be.visible')
  //     .and('contain.text', 'Filter').within(() => {
  //       cy.wait(500)
  //       // cy.get('div.container-class') // Adjust to match the actual parent container class
  // // .within(() => {
  // //   cy.get('input[placeholder="Search Robot"]')
  // //     .should('be.visible')
  // //     .type('test');
  // // })
  //     //  // Ensure the input is visible
  //     //   .type('test');     

     
  //     cy.contains('button', /Apply|Reset Changes|filter|search/i).click();
  //   });
cy.wait(1000)
    // Reset filters
    cy.contains('Reset').click();

    // Check table visibility and content
    cy.get('table').should('be.visible')
      .find('tbody tr').should('have.length.gt', 0);

    // Select last checkbox
    cy.get('table tbody tr:last-child input[type="checkbox"]').click();

    // Click download button
    cy.get('img[src="/upload/icons/icon_download.svg"][width="18"][height="18"]')
      .first()
      .should('be.visible')
      .click();

    // Open and interact with options menu
    cy.get('tbody tr')
      .first()
      .find('button, [role="button"]')
      .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
      .click();

    cy.contains('span', 'View').click();
  });
});

// Custom commands (place in cypress/support/commands.js)
Cypress.Commands.add('login', (email, password) => {
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().then(url => cy.log(`URL after login: ${url}`));
        cy.wait(10000);
        cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
        cy.wait(10000);
        cy.wait(10000);
        cy.url().then(url => cy.log(`URL after 20 seconds: ${url}`));
        cy.wait(20000);
});