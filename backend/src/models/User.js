/**
 * User Model
 * Defines the user schema with authentication and role-based access control
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Available user roles
const ROLES = ['user', 'admin'];

/**
 * User Schema Definition
 * Includes name, email, password, and role fields with validation
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // Remove whitespace from beginning and end
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true, // Ensure email uniqueness
      lowercase: true, // Convert to lowercase
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      minlength: 6, // Minimum password length
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ROLES, // Only allow values from ROLES array
      default: 'user', // Default role for new users
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

/**
 * Pre-save Hook: Password Hashing
 * Automatically hashes password before saving to database
 * Only hashes if password field has been modified
 */
userSchema.pre('save', async function hashPassword(next) {
  // Skip hashing if password hasn't changed
  if (!this.isModified('password')) {
    return next();
  }

  // Generate salt and hash password with bcrypt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance Method: Compare Password
 * Compares a candidate password with the stored hashed password
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


