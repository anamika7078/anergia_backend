const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Controllers
const websiteSettingsController = require('../controllers/websiteSettingsController');
const serviceController = require('../controllers/serviceController');
const productController = require('../controllers/productController');
const blogController = require('../controllers/blogController');
const contactFormController = require('../controllers/contactFormController');
const requestDemoController = require('../controllers/requestDemoController');
const adminController = require('../controllers/adminController');

/**
 * Admin Routes - Authentication Required
 * All routes are protected with JWT authentication
 */

// Admin Authentication (No auth required for login/register)
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  adminController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  adminController.login
);

router.get('/me', authenticate, adminController.getMe);

// Website Settings
router.put('/settings', authenticate, websiteSettingsController.updateSettings);

// Services
router.get('/services', authenticate, serviceController.getAllServices);
router.post(
  '/services',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('category').isIn(['igaming', 'crypto']).withMessage('Category must be igaming or crypto'),
    validate,
  ],
  serviceController.createService
);
router.put('/services/:id', authenticate, serviceController.updateService);
router.delete('/services/:id', authenticate, serviceController.deleteService);

// Products
router.get('/products', authenticate, productController.getAllProducts);
router.post(
  '/products',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    validate,
  ],
  productController.createProduct
);
router.put('/products/:id', authenticate, productController.updateProduct);
router.delete('/products/:id', authenticate, productController.deleteProduct);

// Blogs
router.get('/blogs', authenticate, blogController.getAllBlogs);
router.post(
  '/blogs',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    validate,
  ],
  blogController.createBlog
);
router.put('/blogs/:id', authenticate, blogController.updateBlog);
router.delete('/blogs/:id', authenticate, blogController.deleteBlog);

// Contact Forms
router.get('/contacts', authenticate, contactFormController.getAllContacts);
router.get('/contacts/:id', authenticate, contactFormController.getContactById);
router.put(
  '/contacts/:id',
  authenticate,
  [
    body('status').isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status'),
    validate,
  ],
  contactFormController.updateContactStatus
);
router.delete('/contacts/:id', authenticate, contactFormController.deleteContact);

// Demo Requests
router.get('/request-demos', authenticate, requestDemoController.getAllDemoRequests);
router.get('/request-demos/:id', authenticate, requestDemoController.getDemoRequestById);
router.put(
  '/request-demos/:id',
  authenticate,
  [
    body('status').isIn(['new', 'contacted', 'scheduled', 'completed', 'archived']).withMessage('Invalid status'),
    validate,
  ],
  requestDemoController.updateDemoRequestStatus
);
router.delete('/request-demos/:id', authenticate, requestDemoController.deleteDemoRequest);

module.exports = router;

