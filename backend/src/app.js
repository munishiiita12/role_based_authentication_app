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

// Configure CORS middleware
// Allows requests from specified origins and enables credentials (cookies)
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g., mobile apps) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

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
app.use((err, _req, res, _next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;

