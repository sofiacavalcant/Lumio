import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { apiLimiter, geminiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

import geminiRoutes from './routes/gemini.routes.js';
import transacoesRoutes from './routes/transacoes.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../src')));

app.use('/api/', apiLimiter);
app.use('/api/gemini', geminiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/transacoes', transacoesRoutes);
app.use('/api/gemini', geminiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', projeto: 'Lumio', versao: '1.0.0' });
});

app.use(errorHandler);

export default app;
