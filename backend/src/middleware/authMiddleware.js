/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to the request object
 * Supports tokens from cookies or Authorization header
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using JWT tokens
 * Extracts token from cookie or Authorization header, verifies it, and loads user
 * @async
 * @param {Object} req - Express request object
 * @param {Object} _res - Express response object (unused)
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = async (req, _res, next) => {
  try {
    // Extract token from cookie or Authorization header (Bearer token)
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    // Get JWT secret from environment variables
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      const error = new Error('JWT_SECRET not set');
      error.statusCode = 500;
      throw error;
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, secret);
    
    // Load user from database (excluding password)
    const user = await User.findById(decoded.sub).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    // Attach user ID and user object to request for use in route handlers
    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    // Handle token expiration specifically
    if (error.name === 'TokenExpiredError') {
      error.statusCode = 401;
      error.message = 'Token expired';
    }

    next(error);
  }
};

module.exports = authMiddleware;

