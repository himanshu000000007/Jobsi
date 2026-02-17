import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaNewspaper,
  FaCheckCircle,
} from 'react-icons/fa';

const Sidebar = ({ role }) => {
  const location = useLocation();

  // Normalize role to lowercase for consistent key lookup
  const normalizedRole = (role || '').toLowerCase().replace('_', '');

  const menuItems = {
    jobseeker: [
      { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
      { path: '/feed', icon: FaNewspaper, label: 'Feed' },
      { path: '/resume', icon: FaFileAlt, label: 'Resume Builder' },
      { path: '/ats', icon: FaCheckCircle, label: 'ATS Checker' },
      { path: '/my-applications', icon: FaBriefcase, label: 'My Applications' },
    ],
    recruiter: [
      { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
      { path: '/my-jobs', icon: FaBriefcase, label: 'My Jobs' },
      { path: '/feed', icon: FaNewspaper, label: 'Feed' },
      { path: '/applications', icon: FaUsers, label: 'Applications' },
    ],
    admin: [
      { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
      { path: '/users', icon: FaUsers, label: 'Users' },
      { path: '/jobs', icon: FaBriefcase, label: 'Jobs' },
      { path: '/recruiters', icon: FaCheckCircle, label: 'Approvals' },
      { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
    ],
  };

  // Handles "jobseeker", "job_seeker", "JOBSEEKER", "JOB_SEEKER" etc.
  const items = menuItems[normalizedRole] || [];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-16">
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-lg" />
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