import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiBriefcase,
  FiFileText, FiCheckCircle, FiMessageSquare,
} from 'react-icons/fi';

// Must match Sidebar.jsx and App.jsx normalization exactly
const normalizeRole = (role = '') => role.toLowerCase().replace('_', '');

const Navbar = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);
  const [isMobileOpen,    setIsMobileOpen]    = useState(false);
  const [isDropdownOpen,  setIsDropdownOpen]  = useState(false);

  const role = normalizeRole(user?.role);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FiBriefcase className="text-blue-600" size={32} />
              <span className="text-xl font-bold text-gray-900">JobPortal</span>
            </Link>
          </div>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Common */}
                <Link to="/feed" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  <FiMessageSquare size={18} /><span>Feed</span>
                </Link>

                {/* Job Seeker — FIX: routes match App.jsx registrations */}
                {role === 'jobseeker' && (
                  <>
                    <Link to="/jobs"            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">Browse Jobs</Link>
                    <Link to="/resume"          className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                      <FiFileText size={18} /><span>Resume</span>
                    </Link>
                    <Link to="/ats"             className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                      <FiCheckCircle size={18} /><span>ATS Checker</span>
                    </Link>
                    <Link to="/my-applications" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">My Applications</Link>
                  </>
                )}

                {/* Recruiter */}
                {role === 'recruiter' && (
                  <>
                    <Link to="/post-job" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">Post Job</Link>
                    <Link to="/my-jobs"  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">My Jobs</Link>
                  </>
                )}

                {/* Admin */}
                {role === 'admin' && (
                  <>
                    <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">Manage Users</Link>
                    <Link to="/admin/jobs"  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">Manage Jobs</Link>
                  </>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                        <Link to="/profile"   onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition">
                          <FiUser size={18} /><span>My Profile</span>
                        </Link>
                        <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition">
                          <FiBriefcase size={18} /><span>Dashboard</span>
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition"
                        >
                          <FiLogOut size={18} /><span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-200 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <Link to="/profile" onClick={() => setIsMobileOpen(false)} className="flex items-center space-x-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">
                  <FiUser size={20} /><span>My Profile</span>
                </Link>
                <Link to="/feed" onClick={() => setIsMobileOpen(false)} className="flex items-center space-x-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">
                  <FiMessageSquare size={20} /><span>Feed</span>
                </Link>

                {role === 'jobseeker' && (
                  <>
                    <Link to="/jobs"            onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">Browse Jobs</Link>
                    <Link to="/resume"          onClick={() => setIsMobileOpen(false)} className="flex items-center space-x-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">
                      <FiFileText size={20} /><span>Resume Builder</span>
                    </Link>
                    <Link to="/ats"             onClick={() => setIsMobileOpen(false)} className="flex items-center space-x-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">
                      <FiCheckCircle size={20} /><span>ATS Checker</span>
                    </Link>
                    <Link to="/my-applications" onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">My Applications</Link>
                  </>
                )}

                {role === 'recruiter' && (
                  <>
                    <Link to="/post-job" onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">Post Job</Link>
                    <Link to="/my-jobs"  onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">My Jobs</Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link to="/admin/users" onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">Manage Users</Link>
                    <Link to="/admin/jobs"  onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">Manage Jobs</Link>
                  </>
                )}

                <button
                  onClick={() => { setIsMobileOpen(false); handleLogout(); }}
                  className="flex items-center space-x-2 w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium transition"
                >
                  <FiLogOut size={20} /><span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setIsMobileOpen(false)} className="block text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition">Login</Link>
                <Link to="/register" onClick={() => setIsMobileOpen(false)} className="block bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;