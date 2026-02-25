const mongoose = require('mongoose');

/**
 * Blog Model
 * Represents blog posts/articles
 */
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate excerpt from content if not provided
blogSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for faster queries
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);

