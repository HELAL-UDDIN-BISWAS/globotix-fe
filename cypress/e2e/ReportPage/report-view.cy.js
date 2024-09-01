describe('Report Detail View', () => {
  beforeEach(() => {
    // Assuming the report detail page URL is /reports/:reportId
    cy.visit("/login");
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    // Mock API calls if necessary
    // cy.intercept('GET', '/api/cleaning_reports/*', { fixture: 'reportDetailFixture.json' }).as('getReportDetail');
    // cy.intercept('GET', '/api/robots', { fixture: 'robotsFixture.json' }).as('getRobots');
  });

  it('loads the report detail page', () => {
    const validEmail = "mdhelalu047@gmail.com";
    const validPassword = "12345678";
 
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(20000);
    cy.url().then(url => cy.log(`URL after login: ${url}`));
    cy.wait(10000);
    cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
    cy.wait(10000);
    cy.wait(10000);
    cy.url().then(url => cy.log(`URL after 20 seconds: ${url}`));
    cy.wait(20000);
    cy.visit('/reports');
    cy.wait(5000);
    cy.get('tbody tr')
      .first()
      .find('button, [role="button"]')
      .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
      .should('exist')
      .click();
    cy.wait(5000)

    cy.contains('span', 'View').click();
    cy.wait(10000)
    // displays the correct title with robot name and start time
    // cy.get('#divReportDetail').should('be.visible');

    // shows the area image
    // cy.get('#divAreaImage img').should('be.visible');
    // cy.get('#divAreaImage img').should('have.attr', 'src').and('include', 'api.url/image-path');
    // // displays report information correctly
    cy.get('label:contains("Report Information")').should('be.visible');
    cy.contains('Robot')
    cy.contains('Operator-In-Charge').should('be.visible');
    cy.contains('Location').should('be.visible');
    cy.contains('Start Time').should('be.visible');
    //   shows performance information
    cy.get('label:contains("Performance")').should('be.visible');
    cy.contains('Cleaning Status').next().should('be.visible');
    cy.contains('Time Taken').next().should('contain', 'hour');
    cy.contains('Total Area').next().should('contain', 'm2');
    cy.contains('Cleaned Area').next().should('contain', 'm2');
    // displays component health information
    cy.get('label:contains("Component Health")').should('be.visible');
    cy.contains('Roller Brush').should('be.visible');
    cy.contains('Gutter Brush').should('be.visible');
    cy.contains('Pre-filter (vacuum)').should('be.visible');
    cy.contains('HAPA filter (vacuum)').should('be.visible');
    // shows zone coverage information
    cy.get('label:contains("Zone Coverage")').should('be.visible');
    cy.get('div:contains("Coverage")').should('be.visible');
    cy.get('div:contains("Time Taken")').should('be.visible');
    // navigates back when clicking the back button
    cy.get('svg.cursor-pointer').click();
    // Add assertion for the expected page after navigation
    cy.url().should('not.include', '/reports/');
    // allows downloading PDF report
  });

});