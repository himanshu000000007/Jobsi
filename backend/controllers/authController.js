// Backend Auth Controller - Add this to your existing authController.js
// Or create it if it doesn't exist

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
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'jobseeker',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
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

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      title: user.title,
      bio: user.bio,
      linkedin: user.linkedin,
      github: user.github,
      portfolio: user.portfolio,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      companyName: user.companyName,
      companyWebsite: user.companyWebsite,
      companySize: user.companySize,
      industry: user.industry,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
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

  // Update fields based on user role
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.location = req.body.location || user.location;
  user.title = req.body.title || user.title;
  user.bio = req.body.bio || user.bio;

  // Job seeker specific fields
  if (user.role === 'jobseeker') {
    user.linkedin = req.body.linkedin || user.linkedin;
    user.github = req.body.github || user.github;
    user.portfolio = req.body.portfolio || user.portfolio;
    user.skills = req.body.skills || user.skills;
    user.experience = req.body.experience || user.experience;
    user.education = req.body.education || user.education;
  }

  // Recruiter specific fields
  if (user.role === 'recruiter') {
    user.companyName = req.body.companyName || user.companyName;
    user.companyWebsite = req.body.companyWebsite || user.companyWebsite;
    user.companySize = req.body.companySize || user.companySize;
    user.industry = req.body.industry || user.industry;
    user.linkedin = req.body.linkedin || user.linkedin;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    location: updatedUser.location,
    title: updatedUser.title,
    bio: updatedUser.bio,
    linkedin: updatedUser.linkedin,
    github: updatedUser.github,
    portfolio: updatedUser.portfolio,
    skills: updatedUser.skills,
    experience: updatedUser.experience,
    education: updatedUser.education,
    companyName: updatedUser.companyName,
    companyWebsite: updatedUser.companyWebsite,
    companySize: updatedUser.companySize,
    industry: updatedUser.industry,
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