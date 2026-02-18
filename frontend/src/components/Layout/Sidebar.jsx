import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaBriefcase, FaUsers, FaFileAlt,
  FaChartBar, FaNewspaper, FaCheckCircle,
} from 'react-icons/fa';

// Must match Navbar.jsx and App.jsx normalization exactly
const normalizeRole = (role = '') => role.toLowerCase().replace('_', '');

const menuItems = {
  jobseeker: [
    { path: '/dashboard',       icon: FaHome,        label: 'Dashboard' },
    { path: '/feed',            icon: FaNewspaper,   label: 'Feed' },
    { path: '/jobs',            icon: FaBriefcase,   label: 'Browse Jobs' },
    { path: '/resume',          icon: FaFileAlt,     label: 'Resume Builder' },
    { path: '/ats',             icon: FaCheckCircle, label: 'ATS Checker' },
    { path: '/my-applications', icon: FaBriefcase,   label: 'My Applications' },
  ],
  recruiter: [
    { path: '/dashboard', icon: FaHome,      label: 'Dashboard' },
    { path: '/post-job',  icon: FaBriefcase, label: 'Post a Job' },
    { path: '/my-jobs',   icon: FaBriefcase, label: 'My Jobs' },
    { path: '/feed',      icon: FaNewspaper, label: 'Feed' },
  ],
  admin: [
    { path: '/dashboard',        icon: FaHome,        label: 'Dashboard' },
    { path: '/admin/users',      icon: FaUsers,       label: 'Users' },
    { path: '/admin/jobs',       icon: FaBriefcase,   label: 'Jobs' },
    { path: '/admin/approvals',  icon: FaCheckCircle, label: 'Approvals' },
    { path: '/admin/analytics',  icon: FaChartBar,    label: 'Analytics' },
  ],
};

const Sidebar = ({ role }) => {
  const location      = useLocation();
  const normalizedRole = normalizeRole(role);
  const items          = menuItems[normalizedRole] || [];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-16 flex-shrink-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;