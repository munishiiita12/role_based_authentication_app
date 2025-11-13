/**
 * Validation Utilities
 * Provides Zod schemas and validation functions for request data validation
 */

const { z } = require('zod');

// Role enumeration for validation
const roleEnum = z.enum(['user', 'admin']);

/**
 * Signup Schema
 * Validates user registration data
 */
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: roleEnum,
});

/**
 * Login Schema
 * Validates user login credentials
 */
const loginSchema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

/**
 * Item Create Schema
 * Validates data for creating a new item
 */
const itemCreateSchema = z.object({
  title: z.string().min(2).max(120), // Title between 2 and 120 characters
  description: z.string().max(500).optional().default(''), // Optional description, max 500 chars
  status: z.enum(['todo', 'in-progress', 'done']).optional().default('todo'), // Optional status with default
});

/**
 * Item Update Schema
 * Validates data for updating an item (all fields optional)
 */
const itemUpdateSchema = itemCreateSchema.partial();

/**
 * Pagination Schema
 * Validates pagination query parameters
 */
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1), // Coerce string to number, default 1
  limit: z.coerce.number().int().positive().max(50).optional().default(10), // Max 50 items per page
  search: z.string().optional(), // Optional search term
});

/**
 * Parse and validate data against a schema
 * Throws an error with appropriate status code if validation fails
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {any} Validated and parsed data
 * @throws {Error} If validation fails (with statusCode 400)
 */
const parseWithSchema = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    // Extract first error message or use default
    const message = error.errors?.[0]?.message || 'Validation failed';
    const err = new Error(message);
    err.statusCode = 400; // Bad Request status code
    throw err;
  }
};

module.exports = {
  signupSchema,
  loginSchema,
  itemCreateSchema,
  itemUpdateSchema,
  paginationSchema,
  parseWithSchema,
};


