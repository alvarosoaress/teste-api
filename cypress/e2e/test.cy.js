/// <reference types="cypress" />

const API_URL = 'http://129.148.47.221:8800';

const EMAIL = 'xaiomi@cn.com';

const NEW_EMAIL = 'samsungo@kr.com';

describe('API Test', () => {
  let USER_TOKEN;

  it('should return an array of all users', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}`,
      headers: {},
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(Array.isArray(body)).to.be.true;
    });
  });

  it('should register a new user', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/usuario/registrar`,
      headers: {},
      body: {
        nome: 'Xai Omi',
        email: EMAIL,
        senha: 'senhamuitoseguraconfia7896',
      },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.email).to.eq(EMAIL);
      expect(body.accessToken).to.exist;
      USER_TOKEN = `Bearer ${body.accessToken}`;

      console.log(USER_TOKEN);
    });
  });

  it('should refuse to register same email for two users', () => {
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

  it('should update existing user', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/usuario/atualizar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        nome: 'Mouse Pad',
        email: NEW_EMAIL,
        senha: 'senhamuitoseguraconfia7896',
      },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.nome).to.eq('Mouse Pad');
    });
  });

  it('should refuse to update user if email already exists', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/usuario/atualizar`,
      headers: {
        Authorization: USER_TOKEN,
      },
      body: {
        nome: 'Mouse Pad',
        email: 'joao@email.com',
        senha: 'senhamuitoseguraconfia7896',
      },
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(409);
    });
  });

  it('should delete a user already registered', () => {
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
