/**
 * Authentication Controller
 * Handles user registration, login, logout, and user profile retrieval
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  signupSchema,
  loginSchema,
  parseWithSchema,
} = require('../utils/validators');

// Cookie name for storing JWT token
const COOKIE_NAME = 'token';

/**
 * Creates a JWT token for the given user ID
 * @param {string} userId - The MongoDB user ID
 * @returns {string} JWT token
 * @throws {Error} If JWT_SECRET is not set
 */
const createToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!secret) {
    throw new Error('JWT_SECRET not set');
  }

  // Sign token with user ID in the 'sub' (subject) claim
  return jwt.sign({ sub: userId }, secret, { expiresIn });
};

/**
 * Sets the JWT token as an HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to set
 */
const setTokenCookie = (res, token) => {
  // Default to 24 hours if not specified
  const maxAge =
    Number(process.env.JWT_COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000;

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    sameSite: 'lax', // CSRF protection
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge, // Cookie expiration time
  });
};

/**
 * User Registration Handler
 * Creates a new user account and returns user data with authentication token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.signup = async (req, res, next) => {
  try {
    // Validate and parse request body
    const payload = parseWithSchema(signupSchema, req.body);

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409; // Conflict status code
      throw error;
    }

    // Create new user (password will be hashed by User model pre-save hook)
    const user = await User.create(payload);

    // Generate JWT token and set as cookie
    const token = createToken(user._id);
    setTokenCookie(res, token);

    // Return user data (excluding password)
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login Handler
 * Authenticates user credentials and returns user data with authentication token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    // Validate and parse request body
    const payload = parseWithSchema(loginSchema, req.body);

    // Find user by email
    const user = await User.findOne({ email: payload.email });

    // Verify user exists and password matches
    if (!user || !(await user.comparePassword(payload.password))) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401; // Unauthorized status code
      throw error;
    }

    // Generate JWT token and set as cookie
    const token = createToken(user._id);
    setTokenCookie(res, token);

    // Return user data (excluding password)
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Logout Handler
 * Clears the authentication cookie
 * @param {Object} _req - Express request object (unused)
 * @param {Object} res - Express response object
 */
exports.logout = async (_req, res) => {
  // Clear the authentication cookie with same settings used when setting it
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(204).end(); // No content response
};

/**
 * Get Current User Handler
 * Returns the authenticated user's profile information
 * @async
 * @param {Object} req - Express request object (should have req.user or req.userId from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getMe = async (req, res, next) => {
  try {
    // If user is not already populated by middleware, fetch it
    if (!req.user) {
      const user = await User.findById(req.userId).select('-password');

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      return res.json({ user });
    }

    // Return user from request (already populated by middleware)
    return res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

