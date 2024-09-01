
describe('Edit Schedule Page', () => {
    // =-=-=-==-=-You are login email and password-=-=-=-=-=-
    const validEmail = "mdhelalu047@gmail.com";
    const validPassword = "12345678";

    beforeEach(() => {
        cy.visit("/login");
        cy.on("uncaught:exception", () => false);
    });

    it('should edit a schedule successfully', () => {
        cy.login(validEmail, validPassword);
        cy.navigateToSchedule();
        cy.openScheduleEditForm();
        cy.updateScheduleDetails();
        cy.submitScheduleForm();
    });
});

// Custom commands (add these to commands.js)

Cypress.Commands.add('login', (email, password) => {
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login', { timeout: 30000 });
    cy.url().then(url => cy.log(`URL after login: ${url}`));
    cy.wait(10000);
    cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
    cy.wait(10000);
    cy.wait(10000);
    cy.url().then(url => cy.log(`URL after 20 seconds: ${url}`));
    cy.wait(20000);
});

Cypress.Commands.add('navigateToSchedule', () => {
    cy.visit('/schedule', { timeout: 30000 });

});

Cypress.Commands.add('openScheduleEditForm', () => {
    cy.get('button[aria-haspopup="menu"]').find('svg').last().click();
    cy.wait(1000)
    cy.contains('span', 'Edit').click();
    cy.wait(20000);// Consider replacing with a more specific wait condition
});

Cypress.Commands.add('updateScheduleDetails', () => {
    cy.get('input[name="name"]').clear().type('Updated Schedule');
    cy.get('input[name="cleaningDate"]').clear().type('2024-08-21');
    cy.get('input[name="cleaningPlan"]').click();
    cy.get('input[type="radio"]').first().click();

    cy.contains('span.text-sm.text-white', 'Next')
        .scrollIntoView()
        .click({ force: true });

    cy.get('input[name="cleaningTime"]').clear().type('11:00');

    cy.get('input[name="scheduleType"]').click({ force: true }).type('Auto Docking', { force: true });
    cy.contains('Auto Docking').click();
    cy.get('input[name="repeat"]').type('2024-08-01');
});

Cypress.Commands.add('submitScheduleForm', () => {
    cy.get('button[type="submit"]').click();
    // Add assertion here to verify successful submission
});







