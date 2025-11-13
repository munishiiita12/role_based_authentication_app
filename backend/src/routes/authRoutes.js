/**
 * Authentication Routes
 * Defines endpoints for user authentication and profile management
 */

const express = require('express');
const { signup, login, logout, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signup); // User registration
router.post('/login', login); // User login

// Protected routes (authentication required)
router.post('/logout', authMiddleware, logout); // User logout
router.get('/me', authMiddleware, getMe); // Get current user profile

module.exports = router;


