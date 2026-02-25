const mongoose = require('mongoose');

/**
 * Request Demo Model
 * Stores demo request submissions
 */
const requestDemoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    productInterested: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'scheduled', 'completed', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
requestDemoSchema.index({ status: 1 });
requestDemoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RequestDemo', requestDemoSchema);

