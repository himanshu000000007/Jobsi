// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  UPLOAD_PICTURE: '/auth/upload-picture',
  UPLOAD_RESUME: '/auth/upload-resume',
  CHANGE_PASSWORD: '/auth/change-password',

  // Jobs
  JOBS: '/jobs',
  MY_JOBS: '/jobs/recruiter/my-jobs',
  JOB_APPLICATIONS: (id) => `/jobs/${id}/applications`,
  APPLY_JOB: (id) => `/jobs/${id}/apply`,
  MY_APPLICATIONS: '/jobs/my-applications',
  UPDATE_APPLICATION_STATUS: (id) => `/jobs/applications/${id}/status`,

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_RECRUITERS_PENDING: '/admin/recruiters/pending',
  ADMIN_APPROVE_RECRUITER: (id) => `/admin/recruiters/${id}/approve`,
  ADMIN_DELETE_USER: (id) => `/admin/users/${id}`,
  ADMIN_TOGGLE_USER: (id) => `/admin/users/${id}/toggle-active`,
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_JOBS: '/admin/jobs',

  // Posts
  POSTS: '/posts',
  POST_LIKE: (id) => `/posts/${id}/like`,
  POST_COMMENTS: (id) => `/posts/${id}/comments`,
  DELETE_COMMENT: (id) => `/posts/comments/${id}`,
  USER_POSTS: (userId) => `/posts/user/${userId}`,

  // Resume
  RESUMES: '/resumes',
  MY_RESUME: '/resumes/my-resume',
  UPLOAD_RESUME_PDF: '/resumes/upload-pdf',
  CHANGE_TEMPLATE: '/resumes/change-template',

  // ATS
  ATS_SCAN: '/ats/scan',
  ATS_MY_RESULTS: '/ats/my-results',
  ATS_ANALYZE_KEYWORDS: '/ats/analyze-keywords',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  RECRUITER: 'RECRUITER',
  JOB_SEEKER: 'JOB_SEEKER',
};

// Application Status
export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
  INTERVIEW: 'Interview',
  HIRED: 'Hired',
};

// Job Types
export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Remote',
  'Contract',
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: 0, label: 'Entry Level (0 years)' },
  { value: 1, label: '1+ years' },
  { value: 2, label: '2+ years' },
  { value: 3, label: '3+ years' },
  { value: 5, label: '5+ years' },
  { value: 7, label: '7+ years' },
  { value: 10, label: '10+ years' },
];

// Resume Templates
export const RESUME_TEMPLATES = [
  { id: 'template1', name: 'Professional', preview: '/templates/template1.png' },
  { id: 'template2', name: 'Modern', preview: '/templates/template2.png' },
  { id: 'template3', name: 'Creative', preview: '/templates/template3.png' },
];

// Skill Levels
export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jobPortal_authToken',
  USER_DATA: 'jobPortal_userData',
};
