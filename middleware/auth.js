const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { STATUS } = require('../config/constants');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches admin user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'No token provided. Access denied.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin user
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or inactive admin account.',
      });
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token expired.',
      });
    }
    res.status(STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

module.exports = { authenticate };

