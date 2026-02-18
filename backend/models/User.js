// Backend User Model - Updated with profile fields
// Place this file in: backend/models/User.js

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
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    role: {
  type: String,
  enum: ['jobseeker', 'recruiter', 'admin'],
  default: 'jobseeker',
  // ✅ Always lowercase store karo
  set: (val) => val?.toLowerCase(),
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
    skills: [{
      type: String,
      trim: true,
    }],
    experience: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },

    // Recruiter specific fields
 companyName: {
  type: String,
  required: function() { return this.role === 'RECRUITER'; },
},
    companyWebsite: {
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

companyLogo: {              // ← ADD THIS
  type: String,
  default: null,
},
companyDescription: {
  type: String,
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

const User = mongoose.model('User', userSchema);

module.exports = User;