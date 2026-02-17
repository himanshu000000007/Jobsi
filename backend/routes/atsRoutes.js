// Backend ATS Routes - Define API endpoints for ATS functionality
// Place this file in: backend/src/routes/atsRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  analyzeResume,
  getKeywordSuggestions,
  compareWithJob,
  getAnalysisHistory,
} = require('../controllers/atsController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
});

// @route   POST /api/ats/analyze
// @desc    Analyze resume for ATS compatibility
// @access  Private
router.post('/analyze', protect, upload.single('resume'), analyzeResume);

// @route   POST /api/ats/keywords
// @desc    Get keyword suggestions based on job description
// @access  Private
router.post('/keywords', protect, getKeywordSuggestions);

// @route   POST /api/ats/compare
// @desc    Compare resume with job description
// @access  Private
router.post('/compare', protect, compareWithJob);

// @route   GET /api/ats/history
// @desc    Get user's ATS analysis history
// @access  Private
router.get('/history', protect, getAnalysisHistory);

module.exports = router;