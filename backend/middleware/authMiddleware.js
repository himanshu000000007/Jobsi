const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Verify JWT Token ─────────────────────────────────────────────────────────
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Only block if isActive is explicitly false
    if (req.user.isActive === false) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// ─── Role-based Authorization (CASE-INSENSITIVE) ──────────────────────────────
// FIX: Database mein role lowercase ('admin', 'recruiter', 'job_seeker') ho sakta hai
// But adminRoutes.js mein authorize('ADMIN') uppercase use hota hai
// Solution: Case-insensitive comparison + underscore normalization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Normalize both sides: uppercase + replace underscore/hyphen with underscore
    const userRole       = (req.user.role || '').toUpperCase().replace(/[-\s]/g, '_');
    const allowedRoles   = roles.map((r) => (r || '').toUpperCase().replace(/[-\s]/g, '_'));

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `User role "${req.user.role}" is not authorized to access this route`,
      });
    }
    next();
  };
};

// ─── Check if Recruiter is Approved ───────────────────────────────────────────
// FIX: Case-insensitive role check
exports.checkRecruiterApproval = async (req, res, next) => {
  const userRole = (req.user.role || '').toUpperCase().replace(/[-\s]/g, '_');

  if (userRole === 'RECRUITER' && !req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message: 'Your recruiter account is pending approval from admin',
    });
  }
  next();
};