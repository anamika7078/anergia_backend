require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

/**
 * Initialize Default Admin User
 * Run this script once to create the first admin user
 * 
 * Usage: node scripts/initAdmin.js
 */

const initAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@anergia.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Create default admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@anergia.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin',
      role: 'superadmin',
    });

    console.log('✅ Default admin created successfully!');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

initAdmin();

