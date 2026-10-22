import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

const configuredOrigins = env.CLIENT_ORIGIN
  ? env.CLIENT_ORIGIN.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        configuredOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin === 'http://localhost:5173' ||
        cleanOrigin === 'http://localhost:3000' ||
        env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(
  '/exercise-images',
  express.static(path.join(__dirname, '..', 'public', 'exercise-images')),
);

app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: 'FitVerse Backend API is running',
    health: '/api/health',
  });
});

app.use('/api', globalLimiter, apiRoutes);

if (env.SERVE_STATIC) {
  const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    app.get('/{*splat}', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/exercise-images')) {
        return next();
      }
      return res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }
}

app.use(notFound);
app.use(errorHandler);

export default app;
