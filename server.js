// Load environment variables - use .env if exists, otherwise fallback to env.example
const path = require('path');
const fs = require('fs');
const envPath = path.resolve(process.cwd(), '.env');
const envExamplePath = path.resolve(process.cwd(), 'env.example');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(envExamplePath)) {
  require('dotenv').config({ path: envExamplePath });
  console.log('⚠️  Using env.example - create .env for production (copy env.example to .env)');
} else {
  console.error('❌ No .env or env.example found! Create .env with MONGODB_URI, JWT_SECRET, etc.');
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import constants
const { RATE_LIMIT } = require('./config/constants');

// Initialize Express app
const app = express();

// Connect to MongoDB (async, but don't block server startup)
connectDB().catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  // Don't exit - allow server to start and retry connection
  // MongoDB will buffer operations and connect when available
});

// CORS Configuration - MUST be before other middleware
// Allow multiple origins for development and production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://anergiafrontend.vercel.app',
  'http://localhost:3000',
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a Vercel deployment
    const isAllowed = allowedOrigins.some(allowed => origin === allowed) ||
      origin.endsWith('.vercel.app') || // Allow all Vercel deployments
      origin.includes('localhost'); // Allow localhost in any port
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Security Middleware - Configure helmet to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

// Rate Limiting - Excludes login, register, and OPTIONS requests
const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for OPTIONS (preflight), login and register endpoints
    if (req.method === 'OPTIONS') return true;
    const path = req.originalUrl || req.path;
    return path.includes('/admin/login') || path.includes('/admin/register');
  },
});

// Apply general limiter to all API routes (will skip login/register endpoints)
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use(notFound);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;

