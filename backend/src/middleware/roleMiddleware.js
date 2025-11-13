/**
 * Role-Based Authorization Middleware
 * Restricts route access based on user roles
 * Must be used after authMiddleware to ensure req.user is available
 */

/**
 * Creates middleware that restricts access to users with specific roles
 * @param {...string} roles - One or more allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 * @example
 * // Only allow admin users
 * router.get('/admin-only', authMiddleware, requireRole('admin'), handler);
 * 
 * // Allow both admin and moderator users
 * router.get('/moderated', authMiddleware, requireRole('admin', 'moderator'), handler);
 */
const requireRole = (...roles) => (req, _res, next) => {
  // Check if user exists and has one of the required roles
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error('Forbidden');
    error.statusCode = 403; // Forbidden status code
    return next(error);
  }

  return next();
};

module.exports = requireRole;


