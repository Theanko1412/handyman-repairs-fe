describe('login and register', () => {
  it('user logs in', () => {
    cy.visit("/")

    cy.contains('button', 'Login').first().click();

    cy.get('div[role="menu"] button').contains('Login').click();

    cy.get('input[placeholder="Email"]').type('john.doe@example.com');
    cy.get('input[placeholder="Password"]').type('password');

    cy.get('button[type="submit"]').contains('Login').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Login successful');
    });
  })


  it('user registers', () => {
    cy.intercept('POST', 'http://localhost:8080/api/v1/auth/register/customer', {
      statusCode: 200,
      body: { message: 'Registration successful' }
    }).as('registerCustomer');

    cy.visit('/');

    cy.contains('button', 'Login').first().click();

    cy.get('div[role="menu"] button').contains('Register').click();

    cy.get('input[placeholder="First Name"]').type('testing');
    cy.get('input[placeholder="Last Name"]').type('testingp');
    cy.get('input[placeholder="Email"]').type('testing@testing.com');
    cy.get('input[placeholder="Password"]').type('password');

    cy.get('button[type="submit"]').contains('Register').click();

    cy.wait('@registerCustomer').its('response.statusCode').should('equal', 200);

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Login successful');
    });
  });
})