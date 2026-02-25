const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Controllers
const websiteSettingsController = require('../controllers/websiteSettingsController');
const serviceController = require('../controllers/serviceController');
const productController = require('../controllers/productController');
const blogController = require('../controllers/blogController');
const contactFormController = require('../controllers/contactFormController');
const requestDemoController = require('../controllers/requestDemoController');

/**
 * Public Routes - No Authentication Required
 * These routes are used by the Next.js frontend
 */

// Website Settings
router.get('/settings', websiteSettingsController.getSettings);

// Services
router.get('/services', serviceController.getServices);
router.get('/services/:slug', serviceController.getServiceBySlug);

// Products
router.get('/products', productController.getProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/:id', productController.getProductById);

// Blogs
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:slug', blogController.getBlogBySlug);

// Contact Form
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate,
  ],
  contactFormController.submitContact
);

// Request Demo
router.post(
  '/request-demo',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    validate,
  ],
  requestDemoController.submitRequestDemo
);

module.exports = router;

