const mongoose = require('mongoose');

/**
 * Website Settings Model
 * Stores global website configuration and settings
 */
const websiteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
      default: 'Anergia',
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        default: '',
      },
      instagram: {
        type: String,
        trim: true,
        default: '',
      },
      linkedin: {
        type: String,
        trim: true,
        default: '',
      },
      twitter: {
        type: String,
        trim: true,
        default: '',
      },
    },
    footerText: {
      type: String,
      trim: true,
      default: '',
    },
    hero: {
      title: {
        type: String,
        trim: true,
        default: '',
      },
      subtitle: {
        type: String,
        trim: true,
        default: '',
      },
      image: {
        type: String,
        trim: true,
        default: '',
      },
      video: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
websiteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);

