describe('Login then get services tab', () => {
   beforeEach(() => {
     cy.visit('/');
 
     cy.contains('button', 'Login').first().click();
 
     cy.get('div[role="menu"] button').contains('Login').click();
 
     cy.get('input[placeholder="Email"]').type('john.doe@example.com');
     cy.get('input[placeholder="Password"]').type('password');
 
     cy.get('button[type="submit"]').contains('Login').click();
   });
 
   it('user logs in and navigates to the services tab', () => {
     cy.get('a').contains('Services').click();
 
     cy.url().should('include', '/service');
   });

   it('user logs in and navigates to the handymen tab', () => {
      cy.get('a').contains('Handymen').click();
   
      cy.url().should('include', '/handyman');
   });
   
   it('user logs in and navifates to the categories tab', () => {
      cy.get('a').contains('Categories').click();
   
      cy.url().should('include', '/category');
   });
 });
 