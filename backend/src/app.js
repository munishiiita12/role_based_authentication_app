/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling for the API server
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import route handlers and middleware
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Parse and configure allowed CORS origins from environment variable
// Supports multiple origins separated by commas
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Default to localhost:3000 if no origins are configured
if (!allowedOrigins.length) {
  allowedOrigins.push('http://localhost:3000');
}

// Log allowed origins for debugging (remove in production if needed)
console.log('Allowed CORS origins:', allowedOrigins);
console.log('CLIENT_URL from env:', process.env.CLIENT_URL);

// Create CORS configuration object to reuse
const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, Postman, or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`CORS: Allowing request from origin: ${origin}`);
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.error(`CORS blocked request from origin: ${origin}`);
      console.error(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin} not in allowed list.`));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

// Configure CORS middleware - must be before other middleware
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
// This is especially important for Vercel serverless functions
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    );
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
  } else {
    res.status(403).end();
  }
});

// Parse JSON request bodies
app.use(express.json());

// Parse cookies from request headers
app.use(cookieParser());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Authentication routes (public endpoints)
app.use('/api/auth', authRoutes);

// Item routes (protected - requires authentication)
app.use('/api/items', authMiddleware, itemRoutes);

// Global error handler middleware
// Catches all errors and sends appropriate error responses
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS')) {
    // Set CORS headers even on error response
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    return res.status(403).json({
      message: err.message,
      error: 'CORS_ERROR',
    });
  }
  
  // Set CORS headers for other errors too
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;

