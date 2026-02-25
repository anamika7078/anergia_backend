const { STATUS } = require('../config/constants');
const mongoose = require('mongoose');
const { isConnected, waitForConnection } = require('../config/database');

/**
 * Middleware to check MongoDB connection before handling requests
 * Waits for connection with timeout, returns error if not connected
 */
const checkDBConnection = async (req, res, next) => {
  // Skip connection check for health endpoint
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  // Check connection state
  const readyState = mongoose.connection.readyState;
  
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  // Allow requests if connected
  if (readyState === 1) {
    // Already connected
    return next();
  }

  // If connecting, disconnected, or disconnecting, wait for connection
  // waitForConnection will attempt to reconnect if needed
  const connected = await waitForConnection(20000); // Increased timeout to 20 seconds
  
  if (connected) {
    return next();
  }

  // Connection unavailable after waiting
  // Provide more helpful error message
  const stateMessages = {
    0: 'disconnected',
    2: 'connecting (timeout)',
    3: 'disconnecting',
  };
  
  return res.status(STATUS.SERVER_ERROR).json({
    success: false,
    message: 'Database connection unavailable. Please try again in a moment.',
    error: `Database connection timeout (state: ${stateMessages[readyState] || readyState})`,
    retry: true,
  });
};

module.exports = checkDBConnection;


