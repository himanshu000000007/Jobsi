const mongoose = require('mongoose');

const atsResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    analysis: {
      matchedKeywords: [String],
      missingKeywords: [String],
      skillsMatch: Number,
      experienceMatch: Number,
      educationMatch: Number,
      formatScore: Number,
    },
    suggestions: [{
      type: String,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ATSResult', atsResultSchema);
