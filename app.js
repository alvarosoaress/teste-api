import express from 'express';
import cors from 'cors';
import UserRoutes from './module/user/user.js';
import db from './src/db.js';
import swaggerDocs from './utils/swagger.js';

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

app.get('/docs/swaggerjs', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), './utils/swaggerUi.js'));
});

swaggerDocs(app, Number(PORT));

app.use('/usuario', UserRoutes);

export default app;
