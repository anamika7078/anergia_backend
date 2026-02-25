const Product = require('../models/Product');
const sendResponse = require('../utils/response');
const { STATUS } = require('../config/constants');

/**
 * Get All Products (Public)
 * GET /api/products
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query).sort({ order: 1, createdAt: -1 });
    
    // Map to frontend-compatible format (add id field)
    const mappedProducts = products.map(product => ({
      ...product.toObject(),
      id: product._id,
    }));
    
    sendResponse(res, STATUS.OK, 'Products retrieved successfully', mappedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Featured Products (Public)
 * GET /api/products/featured
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });
    
    // Map to frontend-compatible format (add id field)
    const mappedProducts = products.map(product => ({
      ...product.toObject(),
      id: product._id,
    }));
    
    sendResponse(res, STATUS.OK, 'Featured products retrieved successfully', mappedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Product by ID (Public)
 * GET /api/products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!product) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Product not found');
    }

    sendResponse(res, STATUS.OK, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Products (Admin)
 * GET /api/admin/products
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    sendResponse(res, STATUS.OK, 'Products retrieved successfully', products);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Product (Admin)
 * POST /api/admin/products
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    sendResponse(res, STATUS.CREATED, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Product (Admin)
 * PUT /api/admin/products/:id
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Product not found');
    }

    sendResponse(res, STATUS.OK, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Product (Admin)
 * DELETE /api/admin/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Product not found');
    }

    sendResponse(res, STATUS.OK, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

