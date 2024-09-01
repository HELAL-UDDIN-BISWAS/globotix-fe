// describe("AccountsView", () => {
//     beforeEach(() => {
//         cy.visit("/login");
//         cy.on("uncaught:exception", (err, runnable) => {
//             return false;
//         });
//         cy.intercept('GET', '**/api/auth/roles').as('getRoles');
//         cy.intercept('GET', '**/api/organizations').as('getOrganizations');
//         cy.intercept('GET', '**/api/buildings').as('getBuildings');
//     });

//     it("should log in, navigate to Accounts page, and perform various actions", () => {
//         // Log in with valid credentials
//         const validEmail = "mdhelalu047@gmail.com";
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
//         cy.visit('/accounts');

//         // Check if the Search Input and Filter Button are present
//         cy.get('input[name="search"]').should("exist");
//         cy.get('[data-testid="filter-button"]').should("exist");

//         // Verify if the table of accounts is visible and contains data
//         cy.wait(5000)
//         cy.get("table").should("exist");
//         cy.get("tbody tr").should("have.length.greaterThan", 0);

//         // Store the initial number of rows
//         let initialRowCount;
//         cy.get("tbody tr").then($rows => {
//             initialRowCount = $rows.length;
//         });

//         // Test filter functionality
//         cy.get('[data-testid="filter-button"]').click();
//         cy.get('.modal, .dropdown, [role="dialog"]').within(() => {
//             cy.contains("Active").click();
//             cy.wait(10000);
//             cy.contains(/apply|filter|search/i).click();
//         });
//         cy.get("tbody tr").should("have.length.gt", 0);

//         // Test reset filter functionality
//         cy.contains("Reset").click();

//         // Test search functionality
//         cy.get('input[name="search"]').type("test");
//         cy.wait(1000); // Wait for debounce
//         cy.get("tbody tr").should("have.length.gte", 0);
//         cy.contains("Reset").click();

//         // Test deleting an account
//         cy.wait(1000); // Wait for debounce
       
//         cy.get('[data-testid="New-Account"]')
//             .should('exist')
//             .and('be.visible')
//             .then($button => {
//                 if ($button.length > 0) {
//                     cy.wrap($button).click();
//                     cy.wait(10000);

//                     // Fill out the form
//                     cy.get('input[name="name"]').type('TestUser');
//                     cy.get('[name="organization"]').should('exist');
//                     cy.get('[name="organization"]').parent().click();
//                     cy.wait(500);
//                     cy.get('input[name="email"]').type('testuser@example.com');
//                     cy.get('[name="no_ext"]').parent().click();
//                     cy.wait(500); // Wait for dropdown to appear
//                     cy.get('div[class*="menu"]').should('be.visible').within(() => {
//                         cy.contains('+65').click();
//                     });
//                     cy.get('input[name="phone"]').type('12345678');

//                     // Select role
//                     cy.contains('User').click();

//                     // Submit form
//                     cy.intercept('POST', '**/api/auth/signup').as('createUser');
//                     cy.contains('Create').click();
//                     // cy.go("back");
//                     cy.wait(5000);
//                 }           

//                 cy.wait(5000);
//                 cy.get('button[aria-haspopup="menu"]').find('svg').last().as('menuButton')
//                     .click();
//                 cy.contains('span', 'View').click();
//                 // Now look for and click the Delete option in the dropdown menu
//                 cy.get('input[type="checkbox"]').last().click();
//                 cy.get('[data-testid="button-icon-delete-selected"]')
//                 .click()
//                 cy.wait(1000); // Wait for debounce    
//                 cy.contains("span",'Confirm').click()
//             });
//     });
// });



describe("AccountsView", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.on("uncaught:exception", () => false);
      cy.intercept('GET', '**/api/auth/roles').as('getRoles');
      cy.intercept('GET', '**/api/organizations').as('getOrganizations');
      cy.intercept('GET', '**/api/buildings').as('getBuildings');
    });
  
    it("should log in, navigate to Accounts page, and perform various actions", () => {
      const validEmail = "jonsofi8288@gmail.com";
      const validPassword = "12345678";
  
      // Login
      cy.login(validEmail, validPassword);
      cy.wait(10000);
      cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
      cy.wait(10000);
      cy.wait(10000);
      cy.url().then(url => cy.log(`URL after 20 seconds: ${url}`));
      cy.wait(20000);
      // Navigate to Accounts page
      cy.visit('/accounts');
      cy.url().should('include', '/accounts');
  
      // Verify page elements
      cy.get('input[name="search"]').should("exist");
      cy.get('[data-testid="filter-modal"]')
      .find('button') // Replace 'button' with the appropriate selector for the FilterButton component
    
      cy.wait(5000)
      cy.get("table").should("exist");
      cy.get("tbody tr").should("have.length.greaterThan", 0);
  
      // Test filter functionality
      cy.testFilter();
  
      // Test search functionality
      cy.testSearch();
  
      // Create new account
      cy.createNewAccount();
  
      // Delete account
      cy.deleteAccount();
    });
  });
  
  // Custom commands
  Cypress.Commands.add('login', (email, password) => {
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });
  
  Cypress.Commands.add('testFilter', () => {
    cy.get('[data-testid="filter-modal"]')
    .click({force:true});
    cy.get('.modal, .dropdown, [role="dialog"]').within(() => {
      cy.contains("Active").click();
      cy.contains(/apply|filter|search/i).click();
    });
    cy.get("tbody tr").should("have.length.gt", 0);
    cy.contains("Reset").click();
  });
  
  Cypress.Commands.add('testSearch', () => {
    cy.get('input[name="search"]').type("test");
    cy.wait(1000); // Wait for debounce
    cy.get("tbody tr").should("have.length.gte", 0);
    cy.contains("Reset").click();
  });
  
  Cypress.Commands.add('createNewAccount', () => {
    // cy.get('[data-testid="New-Account"]').click();
    cy.get('a[href="/accounts/add"]').contains('+ New Account').click()
    cy.wait(20000)
    cy.get('input[name="name"]').type('TestUser');
    cy.get('[name="organization"]').parent().click();
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('[name="no_ext"]').parent().click();
    cy.get('div[class*="menu"]').contains('+65').click();
    cy.get('input[name="phone"]').type('12345678');
    cy.contains('User').click();
    cy.intercept('POST', '**/api/auth/signup').as('createUser');
    cy.contains('Create').click();
  });
  
  Cypress.Commands.add('deleteAccount', () => {
    cy.wait(7000)
    cy.get('tbody tr')
    .first()
    .find('button, [role="button"]')
    .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
    .click();
    cy.contains('span', 'View').click();
    cy.get('input[type="checkbox"]').last().click();
    cy.get('[data-testid="button-icon-delete-selected"]').click();
    cy.contains("span", 'Confirm').click();
  });