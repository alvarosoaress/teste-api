import express from 'express';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { deleteSchema, registerSchema, updateSchema } from './userSchema.js';
import validate from '../../validateRequest.js';
import { verifyToken } from '../../jwtMiddleware.js';

const router = express.Router();

async function userExists(userEmail) {
  const query = `
    SELECT id FROM user WHERE email = ?
    `;

  const res = await db.promise().query(query, userEmail);

  return res[0][0];
}

// ---------------------------------------------------

router.route('/listar').get((req, res) => {
  const query = `
    SELECT *
    FROM user;
    `;

  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
});

// ---------------------------------------------------

router.route('/registrar').post(validate(registerSchema), async (req, res) => {
  let userId;

  const userInfo = req.user;

  const userFound = await userExists(userInfo.email);

  if (userFound) {
    return res.status(409).json(`Usuário [${userInfo.email}] já existe!`);
  }

  const query1 = `
    INSERT INTO user (nome, email, senha) VALUES (?)
    `;

  const values = [userInfo.nome, userInfo.email, userInfo.senha];

  const insertRes1 = await db.promise().query(query1, [values]);

  userId = insertRes1[0].insertId;

  const accessToken = jwt.sign({}, 'senhasuperhiperdemaissecretamesmoshiu', {
    expiresIn: '7d',
    subject: userId.toString(),
  });

  const query2 = `
    UPDATE user SET token = ? WHERE id = ${userId}
    `;

  db.query(query2, accessToken, (err, data) => {
    if (err) return res.json(err);
    delete userInfo.senha;
    return res.status(200).json({ ...userInfo, id: userId, accessToken });
  });
});

// ---------------------------------------------------

router
  .route('/atualizar')
  .put(verifyToken, validate(updateSchema), async (req, res) => {
    const userInfo = req.user;

    const duplicateUser = await userExists(userInfo.email);

    if (duplicateUser) {
      return res
        .status(409)
        .json(`Usuário com email [${userInfo.email}] já existe!`);
    }

    if (duplicateUser && req.secureUser.id != duplicateUser) {
      return res
        .status(401)
        .json(
          `Você não tem permissão para realizar essa operação nesse usuário !`,
        );
    }

    const query = `
    UPDATE user SET nome = ?, email = ?, senha = ? WHERE id = ${req.secureUser.id}
    `;

    const values = [userInfo.nome, userInfo.email, userInfo.senha];

    db.query(query, values, (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json({ ...userInfo, id: req.secureUser.id });
    });
  });

// ---------------------------------------------------

router
  .route('/deletar')
  .delete(verifyToken, validate(deleteSchema), async (req, res) => {
    const userEmail = req.user.email;

    const userFound = await userExists(userEmail);

    if (!userFound) {
      return res.status(404).json(`Usuário [${userEmail}] não encontrado!`);
    }

    if (req.secureUser.email != userEmail) {
      return res
        .status(401)
        .json(
          `Você não tem permissão para realizar essa operação no usuário [${decoded.sub}] !`,
        );
    }

    const query = `
    DELETE FROM user WHERE email = ?
    `;

    db.query(query, userEmail, (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json(`Usuário ${userEmail} excluído!`);
    });
  });

// ---------------------------------------------------

export default router;
