const Admin = require('../models/Admin');
const sendResponse = require('../utils/response');
const generateToken = require('../utils/generateToken');
const { STATUS } = require('../config/constants');

/**
 * Register Admin (First Time Setup)
 * POST /api/admin/register
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Admin already exists');
    }

    // Create admin
    const admin = await Admin.create({
      email,
      password,
      name: name || 'Admin',
    });

    // Generate token
    const token = generateToken(admin._id);

    sendResponse(res, STATUS.CREATED, 'Admin registered successfully', {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login Admin
 * POST /api/admin/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin and include password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return sendResponse(res, STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    if (!admin.isActive) {
      return sendResponse(res, STATUS.UNAUTHORIZED, 'Account is inactive');
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return sendResponse(res, STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(admin._id);

    sendResponse(res, STATUS.OK, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Admin Profile
 * GET /api/admin/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    sendResponse(res, STATUS.OK, 'Admin profile retrieved successfully', {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

