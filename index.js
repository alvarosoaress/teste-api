import express from 'express';
import cors from 'cors';
import UserRoutes from './module/user/user.js';
import db from './db.js';

const PORT = 8800;

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  const query = `
    SELECT *
    FROM user;
    `;

  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
});

app.use('/usuario', UserRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`);
});
