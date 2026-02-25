const { STATUS } = require('../config/constants');

/**
 * 404 Not Found Middleware
 * Handles routes that don't exist
 */
const notFound = (req, res, next) => {
  res.status(STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = notFound;

