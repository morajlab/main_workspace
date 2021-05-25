describe('react-html5up-src-components-src-lib-hyperspace: Button component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=button--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to react-html5up-src-components-src-lib-hyperspace!');
    });
});
