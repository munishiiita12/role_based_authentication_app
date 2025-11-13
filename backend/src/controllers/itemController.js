/**
 * Item Controller
 * Handles CRUD operations for items with role-based access control
 */

const mongoose = require('mongoose');
const Item = require('../models/Item');
const {
  itemCreateSchema,
  itemUpdateSchema,
  paginationSchema,
  parseWithSchema,
} = require('../utils/validators');

/**
 * Checks if user is the owner of an item or has admin role
 * @param {Object} user - User object with _id and role
 * @param {Object} item - Item object with owner field
 * @returns {boolean} True if user can modify the item
 */
const isOwnerOrAdmin = (user, item) =>
  item.owner.equals(user._id) || user.role === 'admin';

/**
 * Create Item Handler
 * Creates a new item and associates it with the authenticated user
 * @async
 * @param {Object} req - Express request object (should have req.userId from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createItem = async (req, res, next) => {
  try {
    // Validate and parse request body
    const payload = parseWithSchema(itemCreateSchema, req.body);

    // Create item with authenticated user as owner
    const item = await Item.create({
      ...payload,
      owner: req.userId,
    });

    // Populate owner details for response
    await item.populate('owner', 'name email role');

    res.status(201).json({ item: item.toObject() });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Items Handler
 * Retrieves items with pagination and search functionality
 * Admins see all items, regular users see only their own items
 * @async
 * @param {Object} req - Express request object (should have req.user and req.userId from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getItems = async (req, res, next) => {
  try {
    // Validate and parse query parameters (page, limit, search)
    const { page, limit, search } = parseWithSchema(
      paginationSchema,
      req.query
    );

    // Build query: admins see all items, users see only their own
    const query = req.user.role === 'admin' ? {} : { owner: req.userId };

    // Add search filter if provided (searches in title and description)
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') }, // Case-insensitive search
        { description: new RegExp(search, 'i') },
      ];
    }

    // Calculate pagination skip value
    const skip = (page - 1) * limit;

    // Fetch items and total count in parallel
    const [items, total] = await Promise.all([
      Item.find(query)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email role') // Include owner details
        .lean(), // Return plain JavaScript objects
      Item.countDocuments(query), // Get total count for pagination
    ]);

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1, // Calculate total pages
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Item Handler
 * Updates an existing item (only by owner or admin)
 * @async
 * @param {Object} req - Express request object (should have req.user and req.userId from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.isValidObjectId(id)) {
      const error = new Error('Invalid item id');
      error.statusCode = 400;
      throw error;
    }

    // Validate and parse update payload
    const updates = parseWithSchema(itemUpdateSchema, req.body);

    // Find item by ID
    const item = await Item.findById(id);

    if (!item) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }

    // Check authorization: only owner or admin can update
    if (!isOwnerOrAdmin(req.user, item)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    // Apply updates and save
    Object.assign(item, updates);
    await item.save();
    
    // Populate owner details for response
    await item.populate('owner', 'name email role');

    res.json({ item: item.toObject() });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Item Handler
 * Deletes an existing item (only by owner or admin)
 * @async
 * @param {Object} req - Express request object (should have req.user and req.userId from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.isValidObjectId(id)) {
      const error = new Error('Invalid item id');
      error.statusCode = 400;
      throw error;
    }

    // Find item by ID
    const item = await Item.findById(id);

    if (!item) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }

    // Check authorization: only owner or admin can delete
    if (!isOwnerOrAdmin(req.user, item)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    // Delete the item
    await item.deleteOne();

    res.status(204).end(); // No content response
  } catch (error) {
    next(error);
  }
};

