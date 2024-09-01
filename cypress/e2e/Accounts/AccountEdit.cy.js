describe('AccountEdit', () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.on("uncaught:exception", (err, runnable) => {
            return false;
        });
    })
    it('Account Edit', () => {
        const validEmail = 'jonsofi8288@gmail.com';
        const validPassword = '12345678';
        cy.get('input[name="email"]').type(validEmail);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click().then(() => {
            cy.log('Account Login')
        })
        cy.wait(5000);
        cy.url().should("include", "/verification");
        cy.wait(20000);
        cy.url().should("include", "/dashboard");
        cy.wait(10000);
        cy.visit('/accounts');
        cy.wait(5000);
        cy.get('tbody tr')
            .last()
            .find('button, [role="button"]')
            .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
            .should('exist')
            .click();
        cy.wait(5000);
        // Now look for and click the Edit option in the dropdown menu
        // cy.contains('Edit').should('be.visible').click();
        // cy.wait(5000);
        // cy.contains('button, a', /Edit/i, { timeout: 5000 })
        //     .should('be.visible')
        //     .and('not.be.disabled')
        //     .click({ force: true });
    cy.contains('span', 'Edit').click();
        
      cy.wait(20000);
      
      // Fill out the form
      cy.get('input[name="name"]').clear().type('UpdatedTestUser');
      cy.wait(500);
      
      cy.get('[name="organization"]').should('exist');
      cy.get('[name="organization"]').parent().click();
      cy.wait(1000);
      
      cy.get('input[name="email"]').clear().type('updated.testuser@example.com');
      cy.wait(500);
      
      cy.get('[name="no_ext"]').parent().click();
      cy.wait(1000);
      cy.get('div[class*="menu"]').should('be.visible').within(() => {
        cy.contains('+65').click();
      });
      cy.wait(500);
      
      cy.get('input[name="phone"]').clear().type('87654321');
      cy.wait(500);
      
      // Select role

      cy.contains('User').click();
      cy.wait(500);
      
      // Change status
  
      
      // Submit form
      cy.intercept('PUT', '**/api/users/*').as('updateUser');
      cy.contains('Save Changes').click();
      
      cy.wait(2000);
    })


})