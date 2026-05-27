import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Lumio] Servidor rodando em http://localhost:${PORT}`);
  console.log(`[Lumio] Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
