///<reference types="cypress"/>
describe('Desafio módulo 03 - Testa informações de um usuário específico.', () => {
    it('Verifica informações de usuário, como transações, saldo, nome, etc', () => {
        cy.fixture('dadosUsuario').then((usuario) => {
            cy.login(usuario.email, usuario.senha);
            cy.visit('/home');
            cy.url().should('include', '/home');
            //log para ver as respostas.
            cy.log('Transações do usuário:', usuario.transacoes);
            cy.log('Última transação: ', usuario.transacoes[usuario.transacoes.length - 1].valor);
            //Confere se o nome de usuário aparece na tela.
            cy.contains(usuario.nome).should('be.visible');
            //confere se o valor da última transação corresponde ao valor esperado.
            cy.getByData('lista-transacoes')
              .find('li')
              .last()
              .contains(usuario.transacoes[usuario.transacoes.length - 1].valor);

            
            //Confere se o saldo corresponde ao saldo esperado.
            cy.get('[data-testid="saldo"]').contains(usuario.saldo);
        });
    });
});