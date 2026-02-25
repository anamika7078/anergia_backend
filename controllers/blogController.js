const Blog = require('../models/Blog');
const sendResponse = require('../utils/response');
const { STATUS } = require('../config/constants');

/**
 * Get All Published Blogs (Public)
 * GET /api/blogs
 */
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('-content'); // Exclude full content for list view
    
    // Map to frontend-compatible format
    const mappedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      id: blog._id,
      date: blog.publishedAt ? blog.publishedAt.toISOString().split('T')[0] : blog.createdAt.toISOString().split('T')[0],
      image: blog.thumbnail || '',
    }));
    
    sendResponse(res, STATUS.OK, 'Blogs retrieved successfully', mappedBlogs);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Blog by Slug (Public)
 * GET /api/blogs/:slug
 */
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      published: true 
    });

    if (!blog) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Blog not found');
    }

    // Map to frontend-compatible format
    const mappedBlog = {
      ...blog.toObject(),
      id: blog._id,
      date: blog.publishedAt ? blog.publishedAt.toISOString().split('T')[0] : blog.createdAt.toISOString().split('T')[0],
      image: blog.thumbnail || '',
    };

    sendResponse(res, STATUS.OK, 'Blog retrieved successfully', mappedBlog);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Blogs (Admin)
 * GET /api/admin/blogs
 */
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    sendResponse(res, STATUS.OK, 'Blogs retrieved successfully', blogs);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Blog (Admin)
 * POST /api/admin/blogs
 */
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    sendResponse(res, STATUS.CREATED, 'Blog created successfully', blog);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Blog (Admin)
 * PUT /api/admin/blogs/:id
 */
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Blog not found');
    }

    sendResponse(res, STATUS.OK, 'Blog updated successfully', blog);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Blog (Admin)
 * DELETE /api/admin/blogs/:id
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Blog not found');
    }

    sendResponse(res, STATUS.OK, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

