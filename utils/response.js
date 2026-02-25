const { STATUS, MESSAGES } = require('../config/constants');

/**
 * Standardized API Response Helper
 * Ensures consistent response format across all endpoints
 */
const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message: message || MESSAGES.SUCCESS,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;

