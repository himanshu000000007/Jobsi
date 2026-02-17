import api from './api';

const resumeService = {
  // Get all resumes for the current user
  getResumes: async () => {
    return await api.get('/resume');
  },

  // Get a specific resume
  getResume: async (id) => {
    return await api.get(`/resume/${id}`);
  },

  // Create a new resume
  createResume: async (resumeData) => {
    return await api.post('/resume', resumeData);
  },

  // Update an existing resume
  updateResume: async (id, resumeData) => {
    return await api.put(`/resume/${id}`, resumeData);
  },

  // Delete a resume
  deleteResume: async (id) => {
    return await api.delete(`/resume/${id}`);
  },

  // Download resume as PDF
  downloadResume: async (id) => {
    return await api.get(`/resume/${id}/download`, {
      responseType: 'blob',
    });
  },

  // Analyze resume with ATS
  analyzeResume: async (formData) => {
    return await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get resume templates
  getTemplates: async () => {
    return await api.get('/resume/templates');
  },
};

export default resumeService;