const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getMyApplications,
} = require('../controllers/jobController');
const {
  protect,
  authorize,
  checkRecruiterApproval,
} = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Recruiter routes
router.post(
  '/',
  protect,
  authorize('RECRUITER'),
  checkRecruiterApproval,
  createJob
);
router.put(
  '/:id',
  protect,
  authorize('RECRUITER'),
  checkRecruiterApproval,
  updateJob
);
router.delete(
  '/:id',
  protect,
  authorize('RECRUITER', 'ADMIN'),
  deleteJob
);
router.get(
  '/recruiter/my-jobs',
  protect,
  authorize('RECRUITER'),
  getMyJobs
);
router.get(
  '/:id/applications',
  protect,
  authorize('RECRUITER'),
  checkRecruiterApproval,
  getJobApplications
);
router.put(
  '/applications/:id/status',
  protect,
  authorize('RECRUITER'),
  checkRecruiterApproval,
  updateApplicationStatus
);

// Job Seeker routes
router.post(
  '/:id/apply',
  protect,
  authorize('JOB_SEEKER'),
  applyForJob
);
router.get(
  '/my-applications',
  protect,
  authorize('JOB_SEEKER'),
  getMyApplications
);

module.exports = router;
