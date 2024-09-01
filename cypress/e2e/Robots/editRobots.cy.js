describe('Edit Robots page',()=>{
    const validEmail = "jonsofi8288@gmail.com";
    const validPassword = "12345678";
    const searchTerm = 'TestRobot';
    beforeEach(() => {
        cy.visit('/login');
        cy.on("uncaught:exception", (err, runnable) => false);
    
    });
    it("",()=>{
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
  
        cy.wait(10000)
        cy.get('tbody tr')
            .last()
            .find('button, [role="button"]')
            .filter(':has(svg), .three-dot-button, .ellipsis-button, [aria-label="More options"]')
            .should('exist')
            .click();
  cy.wait(5000)
  cy.get('span.text-sm.font-semibold')
  .contains('Edit')
  .should('be.visible')
  .click(); 
    })
})