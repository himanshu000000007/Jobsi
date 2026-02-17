// Backend ATS History Model - Store ATS analysis history
// Place this file in: backend/src/models/ATSHistory.js

const mongoose = require('mongoose');

const atsHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fileName: {
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
      formattingScore: {
        type: Number,
        default: 0,
      },
      keywordMatch: {
        type: Number,
        default: 0,
      },
      sectionsFound: {
        type: Number,
        default: 0,
      },
    },
    jobDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
atsHistorySchema.index({ user: 1, createdAt: -1 });

const ATSHistory = mongoose.model('ATSHistory', atsHistorySchema);

module.exports = ATSHistory;