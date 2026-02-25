const ContactForm = require('../models/ContactForm');
const sendResponse = require('../utils/response');
const { STATUS } = require('../config/constants');

/**
 * Submit Contact Form (Public)
 * POST /api/contact
 */
exports.submitContact = async (req, res, next) => {
  try {
    const contact = await ContactForm.create(req.body);
    sendResponse(res, STATUS.CREATED, 'Contact form submitted successfully', contact);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Contact Forms (Admin)
 * GET /api/admin/contacts
 */
exports.getAllContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const contacts = await ContactForm.find(query).sort({ createdAt: -1 });
    sendResponse(res, STATUS.OK, 'Contact forms retrieved successfully', contacts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Contact Form (Admin)
 * GET /api/admin/contacts/:id
 */
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await ContactForm.findById(req.params.id);

    if (!contact) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Contact form not found');
    }

    sendResponse(res, STATUS.OK, 'Contact form retrieved successfully', contact);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Contact Form Status (Admin)
 * PUT /api/admin/contacts/:id
 */
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await ContactForm.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Contact form not found');
    }

    sendResponse(res, STATUS.OK, 'Contact form status updated successfully', contact);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Contact Form (Admin)
 * DELETE /api/admin/contacts/:id
 */
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await ContactForm.findByIdAndDelete(req.params.id);

    if (!contact) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Contact form not found');
    }

    sendResponse(res, STATUS.OK, 'Contact form deleted successfully');
  } catch (error) {
    next(error);
  }
};

