require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists (use lowercase 'admin' to match the model's setter)
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('❌ Admin user already exists:', adminExists.email);
      process.exit(0);
    }

    const plainPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // ✅ Hash the password before saving — this is the critical fix
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'himanshubhukar@jobportal.com',
      password: hashedPassword, // ✅ store the hash, not plain text
      role: 'admin',            // ✅ lowercase to match enum
      isActive: true,
      isApproved: true,         // ✅ admins don't need approval
    });

    console.log('✅ Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Password:', plainPassword);
    console.log('⚠️  Please change the password after first login');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();