import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import workshopRoutes from './routes/workshopRoutes';
import serviceRequestRoutes from './routes/serviceRequestRoutes';
import quotationRoutes from './routes/quotationRoutes';
import workerRoutes from './routes/workerRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'RoadGuard API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// API Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/workshops', workshopRoutes);
app.use('/service-requests', serviceRequestRoutes);
app.use('/quotations', quotationRoutes);
app.use('/workers', workerRoutes);
app.use('/upload', uploadRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  // Default error status and message
  let status = 500;
  let message = 'Internal server error';

  const err = error as any;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid data format';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Duplicate data error';
  }

  // Send error response
  res.status(status).json({
    success: false,
    message,
    ...(process.env['NODE_ENV'] === 'development' && {
      error: error.message,
      stack: error.stack
    })
  });
});

// Graceful shutdown handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
