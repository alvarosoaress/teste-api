/// <reference types="cypress" />

const API_URL = 'http://129.148.47.221:8800';

const NAME = 'Amanda';

const EMAIL = 'amanda@cn.com';

const NEW_EMAIL = 'alice@kr.com';

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
        nome: NAME,
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
      expect(body.nome).to.eq(NAME);
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
        nome: 'Alice',
        email: NEW_EMAIL,
        senha: 'senhamuitoseguraconfia7896',
      },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.nome).to.eq('Alice');
    });
  });

  it('deve impedir a atualização do email de usuário para um já cadastrado', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/usuario/atualizar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        nome: 'Alice',
        email: 'joao@email.com',
        senha: 'senhamuitoseguraconfia7896',
      },
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(409);
    });
  });

  it('deve impedir a exclusão de um usuário com email dissociado ao token', () => {
    cy.request({
      method: 'DELETE',
      url: `${API_URL}/usuario/deletar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        email: 'joao@email.com',
      },
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(401);
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
        email: EMAIL,
      },
    }).then(({ status }) => {
      expect(status).to.eq(200);
    });
  });
});
