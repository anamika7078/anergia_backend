/**
 * Application constants and configuration values
 */

module.exports = {
  // API Response Messages
  MESSAGES: {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
  },

  // HTTP Status Codes
  STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
  },
};

