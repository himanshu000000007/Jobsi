import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ This is already correct - empty dependency array
  useEffect(() => {
    fetchAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_ANALYTICS);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => dispatch(logout())} />
      
      <div className="flex">
        <Sidebar role={user?.role} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="card bg-blue-50">
                    <p className="text-gray-600 text-sm mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics?.users?.total || 0}
                    </p>
                  </div>
                  <div className="card bg-green-50">
                    <p className="text-gray-600 text-sm mb-2">Job Seekers</p>
                    <p className="text-3xl font-bold text-green-600">
                      {analytics?.users?.jobSeekers || 0}
                    </p>
                  </div>
                  <div className="card bg-purple-50">
                    <p className="text-gray-600 text-sm mb-2">Recruiters</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics?.users?.recruiters || 0}
                    </p>
                  </div>
                  <div className="card bg-orange-50">
                    <p className="text-gray-600 text-sm mb-2">Pending Approvals</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {analytics?.users?.pendingRecruiters || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card">
                    <p className="text-gray-600 text-sm mb-2">Total Jobs</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {analytics?.jobs?.total || 0}
                    </p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm mb-2">Active Jobs</p>
                    <p className="text-3xl font-bold text-green-600">
                      {analytics?.jobs?.active || 0}
                    </p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm mb-2">Total Applications</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics?.applications?.total || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                    <div className="space-y-2">
                      {analytics?.recent?.users && analytics.recent.users.length > 0 ? (
                        analytics.recent.users.map((u) => (
                          <div key={u._id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-sm text-gray-600">{u.email}</p>
                            </div>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                              {u.role}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No recent users</p>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                    <div className="space-y-2">
                      {analytics?.recent?.jobs && analytics.recent.jobs.length > 0 ? (
                        analytics.recent.jobs.map((job) => (
                          <div key={job._id} className="py-2 border-b">
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-gray-600">{job.companyName}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No recent jobs</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;