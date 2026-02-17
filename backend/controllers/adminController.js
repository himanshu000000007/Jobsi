const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending recruiters
// @route   GET /api/admin/recruiters/pending
// @access  Private (Admin)
exports.getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: 'RECRUITER',
      isApproved: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recruiters.length,
      recruiters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve/Reject recruiter
// @route   PUT /api/admin/recruiters/:id/approve
// @access  Private (Admin)
exports.approveRecruiter = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'RECRUITER') {
      return res.status(400).json({
        success: false,
        message: 'User is not a recruiter',
      });
    }

    user.isApproved = isApproved;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Recruiter ${isApproved ? 'approved' : 'rejected'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ role: 'JOB_SEEKER' });
    const recruiters = await User.countDocuments({ role: 'RECRUITER' });
    const approvedRecruiters = await User.countDocuments({
      role: 'RECRUITER',
      isApproved: true,
    });
    const pendingRecruiters = await User.countDocuments({
      role: 'RECRUITER',
      isApproved: false,
    });

    // Count jobs
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });

    // Count applications
    const totalApplications = await Application.countDocuments();
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent activities
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobs = await Job.find()
      .select('title companyName createdAt')
      .populate('recruiterId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          jobSeekers,
          recruiters,
          approvedRecruiters,
          pendingRecruiters,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          inactive: totalJobs - activeJobs,
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus,
        },
        recent: {
          users: recentUsers,
          jobs: recentJobs,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all jobs (admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const jobs = await Job.find()
      .populate('recruiterId', 'name email companyName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Job.countDocuments();

    res.status(200).json({
      success: true,
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
