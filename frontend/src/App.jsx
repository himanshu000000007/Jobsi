import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Redux
import { loadUser } from './redux/slices/authSlice';

// Common
import Loader from './components/Common/Loader';

// Pages
import LandingPage      from './pages/LandingPage';
import Login            from './pages/Auth/Login';
import Register         from './pages/Auth/Register';
import JobSeekerDashboard  from './pages/Dashboard/JobSeekerDashboard';
import RecruiterDashboard  from './pages/Dashboard/RecruiterDashboard';
import AdminDashboard      from './pages/Dashboard/AdminDashboard';
import FeedPage            from './pages/FeedPage';
import ResumePage          from './pages/ResumePage';
import ATSPage             from './pages/ATSPage';
import MyApplicationsPage  from './pages/MyApplicationsPage';
import JobsPage            from './pages/JobsPage';
import PostJobPage         from './pages/PostJobPage';
import MyJobsPage          from './pages/MyJobsPage';
// ✅ FIX BUG 1: Import role-based ProfilePage from pages/Profile/ProfilePage.jsx
// NOT the generic ProfilePage.jsx in pages root
import ProfilePage         from './pages/Profile/ProfilePage';
import AdminUsersPage      from './pages/Admin/AdminUsersPage';
import AdminJobsPage       from './pages/Admin/AdminJobsPage';
import AdminApprovalsPage  from './pages/Admin/AdminApprovalsPage';
import AdminAnalyticsPage  from './pages/Admin/AdminAnalyticsPage';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalizeRole = (role = '') => role.toLowerCase().replace('_', '');

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// ─── Role Guard ───────────────────────────────────────────────────────────────
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const role = normalizeRole(user?.role);
  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── Dashboard Router ─────────────────────────────────────────────────────────
const DashboardRouter = () => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const role = normalizeRole(user.role);

  switch (role) {
    case 'admin':     return <AdminDashboard />;
    case 'recruiter': return <RecruiterDashboard />;
    case 'jobseeker': return <JobSeekerDashboard />;
    default:          return <Navigate to="/login" replace />;
  }
};

// ─── Inner App (inside Router context) ───────────────────────────────────────
function AppRoutes() {
  const { token, user, isLoading } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"         element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* ── Dashboard (role-aware) ── */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

      {/* ── Common Protected ── */}
      <Route path="/feed"    element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
      {/* ✅ Now routes to role-based profile (JobSeekerProfile/RecruiterProfile/AdminProfile) */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* ── Job Seeker Only ── */}
      <Route path="/jobs"            element={<ProtectedRoute><RoleRoute allowedRoles={['jobseeker']}><JobsPage /></RoleRoute></ProtectedRoute>} />
      <Route path="/resume"          element={<ProtectedRoute><RoleRoute allowedRoles={['jobseeker']}><ResumePage /></RoleRoute></ProtectedRoute>} />
      <Route path="/ats"             element={<ProtectedRoute><RoleRoute allowedRoles={['jobseeker']}><ATSPage /></RoleRoute></ProtectedRoute>} />
      <Route path="/my-applications" element={<ProtectedRoute><RoleRoute allowedRoles={['jobseeker']}><MyApplicationsPage /></RoleRoute></ProtectedRoute>} />

      {/* ── Recruiter Only ── */}
      <Route path="/post-job" element={<ProtectedRoute><RoleRoute allowedRoles={['recruiter']}><PostJobPage /></RoleRoute></ProtectedRoute>} />
      <Route path="/my-jobs"  element={<ProtectedRoute><RoleRoute allowedRoles={['recruiter']}><MyJobsPage /></RoleRoute></ProtectedRoute>} />

      {/* ── Admin Only ── */}
      <Route path="/admin/users"     element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminUsersPage /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/jobs"      element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminJobsPage /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/approvals" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminApprovalsPage /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminAnalyticsPage /></RoleRoute></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
            <div>
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page not found</p>
              <Navigate to="/" replace />
            </div>
          </div>
        }
      />
    </Routes>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <AppRoutes />
    </Router>
  );
}

export default App;