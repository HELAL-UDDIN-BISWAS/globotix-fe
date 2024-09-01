// describe('Robots View', () => {
//     beforeEach(() => {
//       cy.visit('/login');
//       cy.on("uncaught:exception", (err, runnable) => {
//         return false;
//     });
//       cy.intercept('GET', '**/api/robots*').as('getRobots');
//       cy.intercept('DELETE', '**/api/robots/*').as('deleteRobot');
//     });

// 	it("should successfully log in with valid credentials and redirect to verification page", () => {
// 	   const validEmail = "mdhelal6775@gmail.com";
//         const validPassword = "12345678";
//         cy.get('input[name="email"]').type(validEmail);
//         cy.get('input[name="password"]').type(validPassword);

//         cy.get('button[type="submit"]').click().then(() => {
//             cy.log('Login button clicked');
//         });

//         // Wait for login process and redirection
//         cy.url().then(url => cy.log(`URL after login: ${url}`));
//         cy.wait(10000);
//         cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
//         cy.wait(10000);
//         cy.url().then(url => cy.log(`URL after 20 seconds: ${url}`));
//         cy.wait(20000);
//         cy.visit('/robots');
//         cy.wait(10000);
//         //   cy.wait('@getRobots');
//       cy.get('table').should('be.visible');
//       cy.get('tbody tr').should('have.length.gt', 0);

//       const searchTerm = 'TestRobot';
//       cy.get('input[name="search"]').type(searchTerm);
     
//       cy.contains('Reset').click();

//     // //   should filter robots


//     cy.get('[data-testid="filter-button"]').click();
//     cy.get('.modal, .dropdown, [role="dialog"]').within(() => {
//         cy.contains("Idle").click();
//         cy.wait(10000);
//         cy.contains(/apply|filter|search/i).click();
//     });
//       cy.contains('Reset').click();
     




//     //   should delete a robot
//       // cy.get('tbody tr').first().within(() => {
//       //   cy.get('[data-testid="delete-button"]').click();
//       // });
//       // cy.get('.modal').within(() => {
//       //   cy.contains(/confirm|yes|delete/i).click();
//       // });
//       // cy.wait('@deleteRobot');
//       // cy.contains('Robot have been deleted').should('be.visible');

//     //   =-=-=-
//     // should bulk delete robots
//     // cy.get('thead input[type="checkbox"]').check();
//     // cy.get('[data-testid="bulk-delete-button"]').click();
//     // cy.get('.modal').within(() => {
//     //   cy.contains(/confirm|yes|delete/i).click();
//     // });
//     // cy.wait('@deleteRobot');
//     // cy.contains('Robots have been deleted').should('be.visible');

//     cy.wait(5000);

//     cy.get('tbody tr')
//         .last()
//         .find('button, [role="button"]')
//         .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
//         .should('exist')
//       .click();

// cy.wait(5000);
// cy.contains('View', { timeout: 10000 }).click({ force: true });
// cy.wait(5000);
// cy.visit('/robots');




//     cy.get('tbody tr')
//         .last()
//         .find('button, [role="button"]')
//         .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
//         .should('exist')
//       .click();

// cy.wait(5000);
// // Now look for and click the Delete option in the dropdown menu
// cy.contains('Delete', { timeout: 10000 }).click({ force: true });
// cy.get('button').contains("Confirm", { timeout: 5000 })
//     .should('be.visible', { timeout: 1000 })
//     .click({ force: true });

// // should navigate to add robot page
//     cy.contains('Add Bot').click();
// 	});  
//   });

describe('Robots View', () => {
  const validEmail = "jonsofi8288@gmail.com";
  const validPassword = "12345678";
  const searchTerm = 'TestRobot';

  beforeEach(() => {
      cy.visit('/login');
      cy.on("uncaught:exception", (err, runnable) => false);
      cy.intercept('GET', '**/api/robots*').as('getRobots');
      cy.intercept('DELETE', '**/api/robots/*').as('deleteRobot');
  });

  it("should log in with valid credentials and interact with the robots view", () => {
      cy.get('input[name="email"]').type(validEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.get('button[type="submit"]').click().then(() => {
          cy.log('Login button clicked');
      });
      cy.wait(30000); // Consolidated wait time

      // Wait for login process and redirection
      // cy.url().should('include', '/verification');
      cy.wait(30000); // Consolidated wait time
      cy.visit('/robots');
      cy.wait(1000); // Add a short wait before checking the intercept

      // Wait for the robots API request to complete

      // Verify the robots table is visible and populated
      cy.get('table').should('be.visible');
      cy.get('tbody tr').should('have.length.gt', 0);

      // Search for a specific robot and reset the search
      cy.get('input[name="search"]').type(searchTerm);
      cy.contains('Reset').click();

      // Filter robots by status
    //   cy.get('[data-testid="filter-button"]').click();
    cy.contains('button', 'Filter').click();
    cy.wait(500)
      cy.get('.modal, .dropdown, [role="dialog"]').within(() => {
          cy.contains("Idle").click();
          cy.contains(/apply|filter|search/i).click();
      });
      cy.contains('Reset').click();
      cy.wait(5000)

      // Open the actions menu for the last robot and view its details
      cy.get('tbody tr')
          .last()
          .find('button, [role="button"]')
          .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
          .should('exist')
          .click();
cy.wait(2000)
      cy.contains('View', { timeout: 10000 }).click({ force: true });
      cy.wait(5000);
      cy.visit('/robots');

      // Open the actions menu for the last robot and delete it
      cy.wait(20000)
      cy.get('tbody tr')
          .last()
          .find('button, [role="button"]')
          .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
          .should('exist')
          .click();
cy.wait(500)
cy.contains('Edit', { timeout: 10000 }).click({ force: true });


    //   cy.contains('Delete', { timeout: 10000 }).click({ force: true });
    //   cy.get('button').contains("Confirm", { timeout: 5000 })
    //       .should('be.visible')
    //       .click({ force: true });

      // Navigate to the add robot page
      // cy.contains('Add Bot').click();
  });
});
