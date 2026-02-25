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
  // Allow requests if connected or actively connecting
  if (readyState === 1) {
    // Already connected
    return next();
  }

  if (readyState === 2) {
    // Connection in progress - wait for it (max 15 seconds)
    const connected = await waitForConnection(15000);
    if (connected) {
      return next();
    }
  }

  // If disconnected, try to wait for connection (max 15 seconds)
  if (readyState === 0 || readyState === 3) {
    const connected = await waitForConnection(15000);
    if (connected) {
      return next();
    }
  }

  // Connection unavailable after waiting
  return res.status(STATUS.SERVER_ERROR).json({
    success: false,
    message: 'Database connection unavailable. Please try again in a moment.',
    error: 'Database connection timeout',
  });
};

module.exports = checkDBConnection;


