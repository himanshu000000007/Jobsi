import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all jobs with filters
export const getAllJobs = async (filters = {}) => {
  const response = await api.get(API_ENDPOINTS.JOBS, { params: filters });
  return response.data;
};

// Get single job by ID
export const getJobById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.JOBS}/${id}`);
  return response.data;
};

// Create new job (Recruiter)
export const createJob = async (jobData) => {
  const response = await api.post(API_ENDPOINTS.JOBS, jobData);
  return response.data;
};

// Update job (Recruiter)
export const updateJob = async (id, jobData) => {
  const response = await api.put(`${API_ENDPOINTS.JOBS}/${id}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.JOBS}/${id}`);
  return response.data;
};

// Get recruiter's jobs
export const getMyJobs = async () => {
  const response = await api.get(API_ENDPOINTS.MY_JOBS);
  return response.data;
};

// Apply for job (Job Seeker)
export const applyForJob = async (jobId, applicationData) => {
  const response = await api.post(API_ENDPOINTS.APPLY_JOB(jobId), applicationData);
  return response.data;
};

// Get applications for a job (Recruiter)
export const getJobApplications = async (jobId) => {
  const response = await api.get(API_ENDPOINTS.JOB_APPLICATIONS(jobId));
  return response.data;
};

// Update application status (Recruiter)
export const updateApplicationStatus = async (applicationId, statusData) => {
  const response = await api.put(
    API_ENDPOINTS.UPDATE_APPLICATION_STATUS(applicationId),
    statusData
  );
  return response.data;
};

// Get job seeker's applications
export const getMyApplications = async () => {
  const response = await api.get(API_ENDPOINTS.MY_APPLICATIONS);
  return response.data;
};

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getMyApplications,
};
