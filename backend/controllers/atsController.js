// Backend ATS Controller - Handles ATS-related API endpoints
// Place this file in: backend/src/controllers/atsController.js

const atsService = require('../services/atsService');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Analyze resume for ATS compatibility
 * @route   POST /api/ats/analyze
 * @access  Private
 */
const analyzeResume = asyncHandler(async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a resume file');
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const jobDescription = req.body.jobDescription || '';

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(fileType)) {
      res.status(400);
      throw new Error('Invalid file type. Please upload PDF or DOCX file');
    }

    // Validate file size (5MB max)
    if (req.file.size > 5 * 1024 * 1024) {
      res.status(400);
      throw new Error('File size too large. Maximum size is 5MB');
    }

    // Perform ATS analysis
    const analysisResult = await atsService.analyzeResume(
      fileBuffer,
      fileType,
      jobDescription
    );

    // Save analysis to user's history (optional)
    if (req.user) {
      await saveAnalysisHistory(req.user._id, analysisResult);
    }

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    res.status(500);
    throw new Error(error.message || 'Failed to analyze resume');
  }
});

/**
 * @desc    Get keyword suggestions based on job description
 * @route   POST /api/ats/keywords
 * @access  Private
 */
const getKeywordSuggestions = asyncHandler(async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      res.status(400);
      throw new Error('Job description is required');
    }

    const suggestions = await atsService.getKeywordSuggestions(jobDescription);

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Keyword Suggestion Error:', error);
    res.status(500);
    throw new Error('Failed to get keyword suggestions');
  }
});

/**
 * @desc    Compare resume with job description
 * @route   POST /api/ats/compare
 * @access  Private
 */
const compareWithJob = asyncHandler(async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      res.status(400);
      throw new Error('Resume ID and job description are required');
    }

    // Get resume from database
    const Resume = require('../models/Resume');
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this resume');
    }

    // Convert resume data to text
    const resumeText = convertResumeToText(resume);

    // Analyze keywords
    const keywordAnalysis = atsService.analyzeKeywords(resumeText, jobDescription);

    res.status(200).json({
      resumeId,
      jobDescription: jobDescription.substring(0, 200) + '...',
      analysis: keywordAnalysis,
    });
  } catch (error) {
    console.error('Compare Error:', error);
    res.status(500);
    throw new Error('Failed to compare resume with job description');
  }
});

/**
 * @desc    Get ATS analysis history
 * @route   GET /api/ats/history
 * @access  Private
 */
const getAnalysisHistory = asyncHandler(async (req, res) => {
  try {
    const ATSHistory = require('../models/ATSHistory');
    
    const history = await ATSHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('score createdAt fileName');

    res.status(200).json(history);
  } catch (error) {
    console.error('History Fetch Error:', error);
    res.status(500);
    throw new Error('Failed to fetch analysis history');
  }
});

/**
 * Helper function to save analysis to history
 */
const saveAnalysisHistory = async (userId, analysisResult) => {
  try {
    const ATSHistory = require('../models/ATSHistory');
    
    await ATSHistory.create({
      user: userId,
      score: analysisResult.score,
      fileName: 'Uploaded Resume',
      analysis: {
        formattingScore: analysisResult.formatting.score,
        keywordMatch: analysisResult.keywords.matchPercentage,
        sectionsFound: analysisResult.sections.found,
      },
    });
  } catch (error) {
    console.error('Failed to save analysis history:', error);
    // Don't throw error, just log it
  }
};

/**
 * Helper function to convert resume object to text
 */
const convertResumeToText = (resume) => {
  let text = '';

  // Personal Info
  if (resume.personalInfo) {
    text += `${resume.personalInfo.fullName}\n`;
    text += `${resume.personalInfo.email}\n`;
    text += `${resume.personalInfo.phone}\n`;
    text += `${resume.personalInfo.summary}\n\n`;
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    text += 'EXPERIENCE\n';
    resume.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`;
      text += `${exp.description}\n\n`;
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    text += 'EDUCATION\n';
    resume.education.forEach(edu => {
      text += `${edu.degree} in ${edu.field} from ${edu.institution}\n\n`;
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    text += 'SKILLS\n';
    resume.skills.forEach(skill => {
      text += `${skill.category}: ${skill.items.join(', ')}\n`;
    });
  }

  return text;
};

module.exports = {
  analyzeResume,
  getKeywordSuggestions,
  compareWithJob,
  getAnalysisHistory,
};