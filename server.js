import app from './app.js';

const PORT = 8800;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`);
});
