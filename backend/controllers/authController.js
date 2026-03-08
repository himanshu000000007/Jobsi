// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, companyName } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (role === 'recruiter' && !companyName) {
    res.status(400);
    throw new Error('Company name is required for recruiters');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'jobseeker',
    phone,
    companyName,
  });

  if (user) {
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        isApproved: user.isApproved,
        isActive: user.isActive,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔍 Login attempt:', { email }); // Debug log

  const user = await User.findOne({ email });
  
  console.log('👤 User found:', user ? 'YES' : 'NO'); // Debug log
  if (user) {
    console.log('🔐 Stored hash:', user.password.substring(0, 20) + '...'); // Debug log
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    console.log('✅ Password match!'); // Debug log
    
    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        title: user.title,
        bio: user.bio,
        avatar: user.avatar,
        linkedin: user.linkedin,
        github: user.github,
        portfolio: user.portfolio,
        socialLinks: user.socialLinks,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        companyLogo: user.companyLogo,
        companyDescription: user.companyDescription,
        companySize: user.companySize,
        industry: user.industry,
        position: user.position,
        isApproved: user.isApproved,
        isActive: user.isActive,
      },
    });
  } else {
    console.log('❌ Password mismatch or user not found'); // Debug log
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

/**
 * @desc    Get user profile (for /api/auth/me endpoint)
 * @route   GET /api/auth/me
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        title: user.title,
        bio: user.bio,
        avatar: user.avatar,
        linkedin: user.linkedin,
        github: user.github,
        portfolio: user.portfolio,
        socialLinks: user.socialLinks,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        companyLogo: user.companyLogo,
        companyDescription: user.companyDescription,
        companySize: user.companySize,
        industry: user.industry,
        position: user.position,
        isApproved: user.isApproved,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // WHITELIST: Only these fields can be updated by users
  const allowedFields = [
    'name', 'phone', 'location', 'title', 'bio', 'avatar',
    'linkedin', 'github', 'portfolio', 'socialLinks',
    'skills', 'experience', 'education',
    'companyName', 'companyWebsite', 'companyLogo', 
    'companyDescription', 'companySize', 'industry', 'position'
  ];

  // Only update allowed fields that are present in request
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      location: updatedUser.location,
      title: updatedUser.title,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      linkedin: updatedUser.linkedin,
      github: updatedUser.github,
      portfolio: updatedUser.portfolio,
      socialLinks: updatedUser.socialLinks,
      skills: updatedUser.skills,
      experience: updatedUser.experience,
      education: updatedUser.education,
      companyName: updatedUser.companyName,
      companyWebsite: updatedUser.companyWebsite,
      companyLogo: updatedUser.companyLogo,
      companyDescription: updatedUser.companyDescription,
      companySize: updatedUser.companySize,
      industry: updatedUser.industry,
      position: updatedUser.position,
      isApproved: updatedUser.isApproved,
      isActive: updatedUser.isActive,
    },
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};