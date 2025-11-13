/**
 * Server Entry Point
 * Initializes the Express application and database connection
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Get port from environment variables or use default port 5000
const PORT = process.env.PORT || 5000;

/**
 * Starts the server and establishes database connection
 * @async
 * @function start
 * @throws {Error} If database connection fails
 */
async function start() {
  try {
    // Connect to MongoDB database
    await connectDB();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    // Log error and exit process if server fails to start
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
start();


