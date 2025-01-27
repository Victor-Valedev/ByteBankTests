///<reference types="cypress"/>
describe('Desafio módulo 04 - Transações e validação na api.', () => {
    const novaTransacao = {
        tipoTransacao: 'Depósito',
        valor: '200'
    };
    it('Deve permitir o usuário acessar a aplicação, realizar uma transação e logout.', () => {
        cy.fixture('usuarios').as('usuarios');

        cy.get('@usuarios').then((usuario) => {
            //Faz o login.
            cy.login(usuario[1].email, usuario[1].senha);

            //Visita a página home e verifica a url correspondente.
            cy.visit('/home');
            cy.url().should('include', '/home');

            //Verifica se o nome do usuário que está logado é visível.
            cy.contains(usuario[1].nome).should('be.visible');
            
            //Verifica se a mensagem de boas vindas é exibida na tela.
            cy.getByData('titulo-boas-vindas').should(
                'contain',
                'Bem vindo de volta!'
            );

            //Seleciona o campo select com as opções de transação.
            cy.getByData('select-opcoes').select(novaTransacao.tipoTransacao);

            //Verifica se a escolha é a que está selecionada no campo de select.
            cy.getByData('select-opcoes').should(
                'have.value',
                novaTransacao.tipoTransacao
            );
            
            //Insere o valor da nova transação.
            cy.getByData('form-input').type(novaTransacao.valor);

            //Verifica se o valor da nova transação está aparecendo na tela.
            cy.getByData('form-input').should(
                'have.value', novaTransacao.valor
            );

            //Clica no botão realizar transação.
            cy.getByData('realiza-transacao').click();

            cy.getByData('lista-transacoes')
              .find('li')
              .last()
              .contains(novaTransacao.valor);

            // TESTANDO A API //
            cy.window().then((win) => {
                //Recupera informações do localStorage.
                const userId = win.localStorage.getItem('userId');

                //Realiza uma requisição para a API no endpoint de transações.
                cy.request({
                    method: 'GET',
                    url: `http://localhost:8000/users/${userId}/transations`,
                    failOnStatusCode: false
                }).then((resposta) => {
                    expect(resposta.status).to.eq(200);
                    expect(resposta.body).is.not.empty;
                    expect(resposta.body).to.lengthOf.at.least(1);
                    expect(resposta.body[resposta.body.length - 1]).to.deep.include(novaTransacao);
                });
            });
        });

        //Clica no botão de sair da aplicação.
        cy.getByData('botao-sair').click();

        //Verifica se a url está de acordo com a página atual.
        cy.url().should('include','/');
        
        //Verifica se é exbido esse texto ao sair da aplicação.
        cy.getByData('titulo-principal').contains(
            'Experimente mais liberdade no controle da sua vida financeira. Crie sua conta com a gente!'
        );
    });
});