import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Common/Loader';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import JobSeekerDashboard from './pages/Dashboard/JobSeekerDashboard';
import RecruiterDashboard from './pages/Dashboard/RecruiterDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import FeedPage from './pages/FeedPage';
import ResumePage from './pages/ResumePage';
import ATSPage from './pages/ATSPage';

// Redux
import { loadUser } from './redux/slices/authSlice';

// ─── Protected Route ────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// ─── Dashboard Router ────────────────────────────────────────────────────────
// FIX #4: Show a full-screen loader while user data is loading.
// Never fall through to a default dashboard — wait until role is confirmed.
const DashboardRouter = () => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  // Still fetching user from server after page refresh
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  // User data not yet hydrated — keep showing loader instead of defaulting
  // to JobSeekerDashboard (which would be wrong for Admin/Recruiter)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const userRole = (user.role || '').toLowerCase().replace('_', '');

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'jobseeker':
      return <JobSeekerDashboard />;
    default:
      // Unknown role — safer to send to login than guess
      return <Navigate to="/login" replace />;
  }
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  // FIX #1: On every app start / page refresh, if a token exists in
  // localStorage, fetch fresh user data from the server.
  // This keeps Redux store in sync after a hard refresh.
useEffect(() => {
  if (token) {
    dispatch(loadUser());
  }
}, [token, dispatch]);
 // eslint-disable-line react-hooks/exhaustive-deps

  // While loadUser is running, show a full-screen loader so routes
  // don't flash incorrect state (e.g. login page before user loads)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    // Future flags silence React Router v6 → v7 deprecation warnings
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: {
            duration: 3000,
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* Landing page — unauthenticated visitors land here */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route path="/feed"   element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
        <Route path="/ats"    element={<ProtectedRoute><ATSPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <Navigate to="/" replace />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;