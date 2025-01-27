import { faker } from '@faker-js/faker/locale/pt_BR';

///<reference types="cypress"/>

describe('Teste de cadastro de usuário', () => {

    //no curso não é passaado isso, o que gera um erro, pois a modal é pequena e o cypress não consegue identificar o botão de enviar.
    beforeEach(() => {
        cy.viewport(1200,990);
    });

    //usado a biblioteca fake.js para gerar dados aleatórios.
    //está dando erro ao utilizar a biblioteca faker.js.
    const usuario = {
       nome: faker.person.fullName(),
       email: faker.internet.email(),
       senha: faker.internet.password()
    };
    it('Deve permitir o usuário cadastrar uma nova conta com suceso', () => {
        cy.visit('/');

        cy.getByData('botao-cadastro').click();
        cy.getByData('nome-input').type(usuario.nome);
        cy.getByData('email-input').type(usuario.email);
        cy.getByData('senha-input').type(usuario.senha);
        cy.getByData('checkbox-input').check();
        //cy.getByData('botao-enviar').click({ force: true }); //forçar o cypress a encontrar o botao.
        cy.getByData('botao-enviar').click();

        cy.getByData('mensagem-sucesso').should('exist').and('have.text', 'Usuário cadastrado com sucesso!');

        cy.request('GET', 'http://localhost:8000/users').then((response) => {
            expect(response.body).to.have.lengthOf.at.least(1); //ver se tem pelo menos 1 usuário
            expect(response.body[response.body.length - 1]).to.deep.include(usuario); //verifica se o usuário é o mesmo.
        });
    });
});