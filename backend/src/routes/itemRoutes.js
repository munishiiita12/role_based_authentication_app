/**
 * Item Routes
 * Defines endpoints for item CRUD operations
 * All routes require authentication (handled by authMiddleware in app.js)
 */

const express = require('express');
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const router = express.Router();

// Routes for item collection (no ID parameter)
router
  .route('/')
  .get(getItems) // Get all items (with pagination and search)
  .post(createItem); // Create a new item

// Routes for individual items (with ID parameter)
router
  .route('/:id')
  .patch(updateItem) // Update an existing item
  .delete(deleteItem); // Delete an item

module.exports = router;


