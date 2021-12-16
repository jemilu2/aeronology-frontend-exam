// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

describe('Example Cypress TodoMVC test', () => {
  beforeEach(() => {
    // usually we recommend setting baseUrl in cypress.json
    // but for simplicity of this example we just use it here
    // https://on.cypress.io/visit
    // eslint-disable-next-line no-undef
    cy.visit('localhost:3000');
  })

  it('Can add a todo by typing and pressing enter', function () {
    cy.get('#todo-title-input')
      .type('learn testing{enter}').wait(1550)

    cy.get(".todo-item").should('have.length', 0)

    cy.get('#todo-title-input')
      .type('learn testing{enter}').wait(1550)
    
    cy.get(".todo-item").should('have.length', 1)
  })

  it('Can add a todo by typing and clicking the add todo button', function () {
    cy.get('#todo-title-input').type('enter a todo item')
      
    cy.get("#add-new-todo").click({ wait: 1600 });

    cy.get('#todo-title-input').type('retry entering and have it succeed')
      
    cy.get("#add-new-todo").click({ wait: 1600 });
    cy.get(".todo-item").should('have.length', 1)
  })

  // more examples
  //
  // https://github.com/cypress-io/cypress-example-todomvc
  // https://github.com/cypress-io/cypress-example-kitchensink
  // https://on.cypress.io/writing-your-first-test
})
