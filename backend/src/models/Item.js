/**
 * Item Model
 * Defines the item schema for task/item management with ownership tracking
 */

const mongoose = require('mongoose');

/**
 * Item Schema Definition
 * Represents a task or item with title, description, status, and owner
 */
const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model for population
      required: true, // Every item must have an owner
    },
    title: {
      type: String,
      required: true,
      trim: true, // Remove whitespace from beginning and end
    },
    description: {
      type: String,
      trim: true, // Remove whitespace from beginning and end
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'], // Only allow these status values
      default: 'todo', // Default status for new items
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Item', itemSchema);


