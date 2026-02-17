const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingRecruiters,
  approveRecruiter,
  deleteUser,
  toggleUserStatus,
  getAnalytics,
  getAllJobsAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are admin only
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-active', toggleUserStatus);

router.get('/recruiters/pending', getPendingRecruiters);
router.put('/recruiters/:id/approve', approveRecruiter);

router.get('/analytics', getAnalytics);
router.get('/jobs', getAllJobsAdmin);

module.exports = router;
