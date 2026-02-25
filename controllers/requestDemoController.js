const RequestDemo = require('../models/RequestDemo');
const sendResponse = require('../utils/response');
const { STATUS } = require('../config/constants');

/**
 * Submit Request Demo (Public)
 * POST /api/request-demo
 */
exports.submitRequestDemo = async (req, res, next) => {
  try {
    const requestDemo = await RequestDemo.create(req.body);
    sendResponse(res, STATUS.CREATED, 'Demo request submitted successfully', requestDemo);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Demo Requests (Admin)
 * GET /api/admin/request-demos
 */
exports.getAllDemoRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const requests = await RequestDemo.find(query).sort({ createdAt: -1 });
    sendResponse(res, STATUS.OK, 'Demo requests retrieved successfully', requests);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Demo Request (Admin)
 * GET /api/admin/request-demos/:id
 */
exports.getDemoRequestById = async (req, res, next) => {
  try {
    const request = await RequestDemo.findById(req.params.id);

    if (!request) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Demo request not found');
    }

    sendResponse(res, STATUS.OK, 'Demo request retrieved successfully', request);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Demo Request Status (Admin)
 * PUT /api/admin/request-demos/:id
 */
exports.updateDemoRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await RequestDemo.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Demo request not found');
    }

    sendResponse(res, STATUS.OK, 'Demo request status updated successfully', request);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Demo Request (Admin)
 * DELETE /api/admin/request-demos/:id
 */
exports.deleteDemoRequest = async (req, res, next) => {
  try {
    const request = await RequestDemo.findByIdAndDelete(req.params.id);

    if (!request) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Demo request not found');
    }

    sendResponse(res, STATUS.OK, 'Demo request deleted successfully');
  } catch (error) {
    next(error);
  }
};

