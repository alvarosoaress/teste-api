import jwt from 'jsonwebtoken';
import db from './db.js';

export const verifyToken = async (req, res, next) => {
  const headerToken = req.headers.authorization ?? req.headers.Authorization;

  if (!headerToken) {
    return res.status(401).json('Token de autorização é necessário !');
  }

  const authToken = headerToken.split(' ')[1].trim();

  jwt.verify(
    authToken,
    'senhasuperhiperdemaissecretamesmoshiu',
    async (err, decoded) => {
      if (!decoded || !decoded.sub) {
        return res.status(401).json('Token de autorização é inválido !');
      }

      const query = `
          SELECT * FROM user WHERE id = ?
        `;

      const dbRes = await db.promise().query(query, decoded.sub);

      if (!dbRes[0][0]) {
        return res.status(401).json('Token de autorização é inválido !');
      }

      const dbUserId = dbRes[0][0].id;
      //   const dbUserEmail = dbRes[0][0].email;

      if (!dbUserId) {
        return res
          .status(404)
          .json(`Usuário com token fornecido não encontrado!`);
      }

      req.secureUser = { ...dbRes[0][0] };

      next();
    },
  );
};
