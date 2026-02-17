// Backend Resume Controller - Handles resume-related API logic
// Place this file in: backend/src/controllers/resumeController.js

const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');

/**
 * @desc    Get all resumes for the current user
 * @route   GET /api/resume
 * @access  Private
 */
const getResumes = asyncHandler(async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-__v');

    res.status(200).json(resumes);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500);
    throw new Error('Failed to fetch resumes');
  }
});

/**
 * @desc    Get a specific resume
 * @route   GET /api/resume/:id
 * @access  Private
 */
const getResume = asyncHandler(async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this resume');
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500);
    throw new Error('Failed to fetch resume');
  }
});

/**
 * @desc    Create a new resume
 * @route   POST /api/resume
 * @access  Private
 */
const createResume = asyncHandler(async (req, res) => {
  try {
    const {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      projects,
      template,
    } = req.body;

    // Validate required fields
    if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
      res.status(400);
      throw new Error('Personal information (name and email) is required');
    }

    const resume = await Resume.create({
      user: req.user._id,
      personalInfo,
      experience: experience || [],
      education: education || [],
      skills: skills || [],
      certifications: certifications || [],
      projects: projects || [],
      template: template || 'modern',
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500);
    throw new Error('Failed to create resume');
  }
});

/**
 * @desc    Update a resume
 * @route   PUT /api/resume/:id
 * @access  Private
 */
const updateResume = asyncHandler(async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this resume');
    }

    const {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      projects,
      template,
    } = req.body;

    // Update fields
    if (personalInfo) resume.personalInfo = personalInfo;
    if (experience) resume.experience = experience;
    if (education) resume.education = education;
    if (skills) resume.skills = skills;
    if (certifications) resume.certifications = certifications;
    if (projects) resume.projects = projects;
    if (template) resume.template = template;

    const updatedResume = await resume.save();

    res.status(200).json(updatedResume);
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500);
    throw new Error('Failed to update resume');
  }
});

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
const deleteResume = asyncHandler(async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this resume');
    }

    await resume.deleteOne();

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500);
    throw new Error('Failed to delete resume');
  }
});

/**
 * @desc    Download resume as PDF
 * @route   GET /api/resume/:id/download
 * @access  Private
 */
const downloadResume = asyncHandler(async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this resume');
    }

    // Note: PDF generation should be handled on frontend using html2pdf.js
    // This endpoint returns the resume data for PDF generation
    res.status(200).json({
      message: 'Resume data retrieved for PDF generation',
      resume,
    });
  } catch (error) {
    console.error('Download Resume Error:', error);
    res.status(500);
    throw new Error('Failed to download resume');
  }
});

module.exports = {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  downloadResume,
};