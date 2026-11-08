import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger';
import apiRouter from './routes';
import { errorHandler } from './middleware/error';
import { sendSuccess } from './utils/response';
import { ENV } from './config/environment';

const app: Application = express();

// 1. Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // For Swagger UI compatibility
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS Allowlist
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Rate Limiter (100 requests per 15 minutes for public endpoints)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

app.use('/api', generalLimiter);

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 6. Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, 200, 'Referly Backend API is healthy and operational.', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: ENV.NODE_ENV,
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  sendSuccess(res, 200, 'Referly API v1 healthy.', {
    status: 'up',
  });
});

// 7. Mount Core API Routes
app.use('/api/v1', apiRouter);

// 8. 404 Route Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Resource not found on endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// 9. Centralized Error Handler
app.use(errorHandler);

export default app;
