const Service = require('../models/Service');
const sendResponse = require('../utils/response');
const { STATUS } = require('../config/constants');

/**
 * Get All Services (Public)
 * GET /api/services
 */
exports.getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    const services = await Service.find(query).sort({ order: 1, createdAt: -1 });
    
    // Map to frontend-compatible format (add id field)
    const mappedServices = services.map(service => ({
      ...service.toObject(),
      id: service._id,
    }));
    
    sendResponse(res, STATUS.OK, 'Services retrieved successfully', mappedServices);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Service by Slug (Public)
 * GET /api/services/:slug
 */
exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!service) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Service not found');
    }

    sendResponse(res, STATUS.OK, 'Service retrieved successfully', service);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Services (Admin)
 * GET /api/admin/services
 */
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    sendResponse(res, STATUS.OK, 'Services retrieved successfully', services);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Service (Admin)
 * POST /api/admin/services
 */
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    sendResponse(res, STATUS.CREATED, 'Service created successfully', service);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Service (Admin)
 * PUT /api/admin/services/:id
 */
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Service not found');
    }

    sendResponse(res, STATUS.OK, 'Service updated successfully', service);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Service (Admin)
 * DELETE /api/admin/services/:id
 */
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Service not found');
    }

    sendResponse(res, STATUS.OK, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

