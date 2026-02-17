import api from './api';

const atsService = {
  // Analyze resume for ATS compatibility
  analyzeResume: async (formData) => {
    return await api.post('/ats/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get keyword suggestions based on job description
  getKeywordSuggestions: async (jobDescription) => {
    return await api.post('/ats/keywords', { jobDescription });
  },

  // Compare resume with job description
  compareWithJob: async (resumeId, jobDescription) => {
    return await api.post('/ats/compare', {
      resumeId,
      jobDescription,
    });
  },

  // Get ATS score history
  getScoreHistory: async () => {
    return await api.get('/ats/history');
  },
};

export default atsService;