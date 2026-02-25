const WebsiteSettings = require('../models/WebsiteSettings');
const sendResponse = require('../utils/response');
const { STATUS } = require('../config/constants');

/**
 * Get Website Settings (Public)
 * GET /api/settings
 */
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    sendResponse(res, STATUS.OK, 'Settings retrieved successfully', settings);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Website Settings (Admin)
 * PUT /api/admin/settings
 */
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    
    if (!settings) {
      settings = await WebsiteSettings.create(req.body);
    } else {
      settings = await WebsiteSettings.findOneAndUpdate(
        {},
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }

    sendResponse(res, STATUS.OK, 'Settings updated successfully', settings);
  } catch (error) {
    next(error);
  }
};

