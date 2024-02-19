/// <reference types="cypress" />

const API_URL = 'http://129.148.47.221:8800';

const EMAIL = 'christine@cn.com';

const NEW_EMAIL = 'sayu@kr.com';

describe('API Test', () => {
  let USER_TOKEN;

  it('deve retornar um array listando todos usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}`,
      headers: {},
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(Array.isArray(body)).to.be.true;
    });
  });

  it('deve registrar um novo usuário', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/usuario/registrar`,
      headers: {},
      body: {
        nome: 'Christine Golden',
        email: EMAIL,
        senha: 'senhamuitoseguraconfia7896',
      },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.email).to.eq(EMAIL);
      expect(body.accessToken).to.exist;
      USER_TOKEN = `Bearer ${body.accessToken}`;
    });
  });

  it('deve impedir o registro de dois usuários com o mesmo email', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/usuario/registrar`,
      headers: {},
      body: {
        nome: 'Luís Silva',
        email: EMAIL,
        senha: 'senhamuitoseguraconfia7896',
      },
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(409);
    });
  });

  it(`deve retornar [nome] e [email] do usuário cadastrado com o email [${EMAIL}]`, () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}/usuario/email/${EMAIL}`,
      headers: {},
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.nome).to.eq('Christine Golden');
    });
  });

  it('deve atualizar um usuário existente', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/usuario/atualizar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        nome: 'Sayu',
        email: NEW_EMAIL,
        senha: 'senhamuitoseguraconfia7896',
      },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.nome).to.eq('Sayu');
    });
  });

  it('deve impedir a atualização do email de um usuário existente para outro também já existente', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/usuario/atualizar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        nome: 'Sayu',
        email: 'joao@email.com',
        senha: 'senhamuitoseguraconfia7896',
      },
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(409);
    });
  });

  it('deve excluir um usuário registrado', () => {
    cy.request({
      method: 'DELETE',
      url: `${API_URL}/usuario/deletar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        email: NEW_EMAIL,
      },
    }).then(({ status }) => {
      expect(status).to.eq(200);
    });
  });
});
