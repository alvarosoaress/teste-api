import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

function swaggerDocs(app, port) {
  const CSS_URL =
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui.css';

  const swaggerJsonDocs = JSON.parse(fs.readFileSync('./utils/openai.json'));

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsonDocs, {
      customCssUrl: CSS_URL,
      customSiteTitle: 'ApiTeste Documentação',
      customJs: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui-bundle.js`,
    }),
  );

  console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
