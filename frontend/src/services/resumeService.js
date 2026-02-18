import api from './api';

// ✅ FIX: Changed /resume → /resumes to match backend app.use('/api/resumes', resumeRoutes)
const resumeService = {
  // Get all resumes for the current user
  getResumes: async () => {
    return await api.get('/resumes');
  },

  // Get a specific resume
  getResume: async (id) => {
    return await api.get(`/resumes/${id}`);
  },

  // Create a new resume
  createResume: async (resumeData) => {
    return await api.post('/resumes', resumeData);
  },

  // Update an existing resume
  updateResume: async (id, resumeData) => {
    return await api.put(`/resumes/${id}`, resumeData);
  },

  // Delete a resume
  deleteResume: async (id) => {
    return await api.delete(`/resumes/${id}`);
  },

  // Download resume as PDF
  downloadResume: async (id) => {
    return await api.get(`/resumes/${id}/download`, {
      responseType: 'blob',
    });
  },

  // Analyze resume with ATS
  analyzeResume: async (formData) => {
    return await api.post('/ats/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get resume templates
  getTemplates: async () => {
    return await api.get('/resumes/templates');
  },
};

export default resumeService;