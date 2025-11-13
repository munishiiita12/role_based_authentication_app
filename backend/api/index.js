/**
 * Vercel Serverless Function Entry Point
 * Exports the Express app as a serverless function handler
 */

const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to database (cached across invocations)
let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    await connectDB();
    isConnected = true;
    console.log('MongoDB connected (serverless)');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Export as Vercel serverless function
module.exports = async (req, res) => {
  // Connect to database on first request
  await connectDatabase();
  
  // Handle the request with Express app
  return app(req, res);
};


