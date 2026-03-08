 // backend/models/User.js
// FIXED: Consistent role handling + added isApproved field

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },//
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker',
      // Always store lowercase for consistency
      set: (val) => val?.toLowerCase().replace('_', ''),
    },
    
    // Common profile fields
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    avatar: {
      type: String,
      default: null,
    },

    // Job Seeker specific fields
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
    },
    skills: [{
      type: String,
      trim: true,
    }],
    experience: [{
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    }],
    education: [{
      degree: String,
      institution: String,
      startDate: String,
      endDate: String,
      gpa: String,
    }],

    // Recruiter specific fields
    companyName: {
      type: String,
      // FIX: Check lowercase since role setter normalizes to lowercase
      required: function() { 
        return this.role === 'recruiter'; 
      },
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      enum: ['', '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '',
    },
    industry: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },

    // Recruiter approval status (added for admin approval workflow)
    isApproved: {
      type: Boolean,
      default: function() {
        // Only recruiters need approval, others are auto-approved
        return this.role !== 'recruiter';
      },
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;