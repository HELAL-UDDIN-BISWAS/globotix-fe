describe('ScheduleAddView', () => {
    beforeEach(() => {
        cy.visit("/login"); // Assuming the calendar is on this route
        cy.on("uncaught:exception", (err, runnable) => {
            return false;
        });
    });

    it('schedule page view and add schedule', () => {

        // =-=-=-==-=-You are login email and password-=-=-=-=-=-
        const validEmail = "mdhelalu047@gmail.com";
        const validPassword = "12345678";
        cy.get('input[name="email"]').type(validEmail);
        cy.get('input[name="password"]').type(validPassword);

        cy.get('button[type="submit"]').click().then(() => {
            cy.log('Login button clicked');
        });

        // Wait for login process and redirection
        cy.url().then(url => cy.log(`URL after login: ${url}`));
        cy.wait(10000);
        cy.url().then(url => cy.log(`URL after 10 seconds: ${url}`));
        cy.wait(10000);
        cy.wait(10000);
        cy.url().then(url => cy.log(`URL after 20 seconds: ${url}`));
        cy.wait(20000);
        cy.visit('/schedule/add');

        //    should display the "Add Schedule" page
       cy.contains('Schedule').should("exist")

       
        cy.contains('Add Schedule').click()
        cy.wait(5000);

        // should display the All input field
        cy.get('input[name="cleaningPlan"]').should('exist');
        cy.get('input[name="name"]').should('exist');
        cy.get('input[name="cleaningDate"]').should('exist');
        cy.get('input[name="cleaningTime"]').should('exist');
        cy.get('input[name="scheduleType"]').should('exist');
        cy.get('input[name="frequency"]').should('exist');
        cy.get('input[name="repeat"]').should('exist');

        //   should submit the form with valid data
        cy.get('input[name="name"]').type('Test Schedule 01');
        cy.get('input[name="cleaningDate"]').type('2024-08-04');
        cy.get('input[name="cleaningTime"]').type('09:00');
        cy.get('input[name="scheduleType"]').click({ force: true }).type('Auto Docking', { force: true })
        cy.contains('Auto Docking').click();


        cy.contains('Select Frequency').click({ force: true });
        cy.contains('Daily').click()
        cy.wait(2000)

        cy.get('input[name="repeat"]').type('2024-08-01');

        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/schedule');
        cy.wait(2000)
        cy.contains("View All Schedules").click()
    });
});