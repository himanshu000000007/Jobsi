// Backend Resume Routes - Define API endpoints for resume functionality
// Place this file in: backend/src/routes/resumeRoutes.js

const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  downloadResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/resume
// @desc    Get all resumes for the current user
// @access  Private
router.get('/', protect, getResumes);

// @route   GET /api/resume/:id
// @desc    Get a specific resume
// @access  Private
router.get('/:id', protect, getResume);

// @route   POST /api/resume
// @desc    Create a new resume
// @access  Private
router.post('/', protect, createResume);

// @route   PUT /api/resume/:id
// @desc    Update a resume
// @access  Private
router.put('/:id', protect, updateResume);

// @route   DELETE /api/resume/:id
// @desc    Delete a resume
// @access  Private
router.delete('/:id', protect, deleteResume);

// @route   GET /api/resume/:id/download
// @desc    Download resume as PDF
// @access  Private
router.get('/:id/download', protect, downloadResume);

module.exports = router;