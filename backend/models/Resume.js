// Backend Resume Model - Resume data schema
// Place this file in: backend/src/models/Resume.js

const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  portfolio: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  field: {
    type: String,
    trim: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  gpa: {
    type: String,
    trim: true,
  },
});

const skillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  items: [{
    type: String,
    trim: true,
  }],
});

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  issuer: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
  },
  expiryDate: {
    type: String,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  technologies: [{
    type: String,
    trim: true,
  }],
  link: {
    type: String,
    trim: true,
  },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    personalInfo: {
      type: personalInfoSchema,
      required: true,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    projects: [projectSchema],
    template: {
      type: String,
      enum: ['modern', 'classic', 'creative'],
      default: 'modern',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
resumeSchema.index({ user: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;