const { STATUS } = require('../config/constants');
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

  // Check if already connected
  if (isConnected()) {
    return next();
  }

  // Wait for connection (max 5 seconds)
  const connected = await waitForConnection(5000);
  
  if (!connected) {
    return res.status(STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Database connection unavailable. Please try again in a moment.',
      error: 'Database connection timeout',
    });
  }

  next();
};

module.exports = checkDBConnection;

