///<reference types="cypress"/>
describe('Realizando requisições para a API.', () => {
  context('GET /users', () => {
    it('Deve retornar uma lista de usuários.', () => {
        cy.request('GET', 'http://localhost:8000/users').then((response) => {
           expect(response.status).to.eq(200);
           expect(response.body).length.to.be.greaterThan(1);
        });
      });
    });

   context('GET /users/:usersId', () => {
    it('Deve retornar um único usuário.', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8000/users/49aff50e-4084-4466-9103-3db5cde23be0'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('nome');
        }); 
    });

    it('Deve retornar um erro quando o usuário for inválido.', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8000/users/49aff50e-4084-4466-9103-3be0',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.eq('Not Found');
        });
      });
    });

    //Desafio
    context('Teste método PUT da API usuários.', () => {
       it('Deve atualizar informações do usuário com sucesso.', () => {
         const usuario = {
            nome: "Victor Vale",
            senha: "12345qa"
         }

         cy.request({
            method: 'PUT',
            url: 'http://localhost:8000/users/49aff50e-4084-4466-9103-3db5cde23be0',
            body: usuario,
            failOnStatusCode: false
         }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.nome).to.eq(usuario.nome);
            expect(response.body.senha).to.eq(usuario.senha);
         })

       }); 
    });


   context('Interceptando solicitações de rede.', () => {
    it('Deve fazer a interceptação do POST para a rota users/login', () => {
        cy.intercept('POST','**/users/login').as('loginRequest');
        cy.login('victorexample@gmail.com','12345qa');
        cy.wait('@loginRequest').then((interception) => {
            interception.response = {
              statusCode: 200,
                body: {
                  sucess: true,
                  message: 'Login bem sucedido!'
               }
            }
        });
        cy.visit('/home');

        cy.getByData('titulo-boas-vindas').should(
            'contains.text',
            'Bem vindo de volta!'
        );
      });
   });

   context('Realizando login via api.', () => {
      it('Deve permitir o login do usuário Victor.', () => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:8000/users/login',
          body: Cypress.env()
        }).then((resposta) => {
          expect(resposta.status).to.eq(200);
          expect(resposta.body).is.not.empty;
          expect(resposta.body.user).to.have.property('nome');
          expect(resposta.body.user.nome).to.be.equal('Victor');
        });
      });
   });
});
