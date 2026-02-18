import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar  from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import api     from '../../services/api';
import { FaUsers, FaBriefcase, FaFileAlt, FaSpinner } from 'react-icons/fa';

const AdminAnalyticsPage = () => {
  const { user }           = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.analytics);
    } catch (err) {
      setError('Failed to load analytics. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
              <button 
                onClick={fetchAnalytics} 
                className="text-sm bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <FaSpinner className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                <p className="text-gray-500">Loading analytics...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-3">{error}</p>
                <button onClick={fetchAnalytics} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Total Users</p>
                      <FaUsers className="text-blue-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{analytics?.users?.total || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Job Seekers</p>
                      <FaUsers className="text-green-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{analytics?.users?.jobSeekers || 0}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Recruiters</p>
                      <FaUsers className="text-purple-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{analytics?.users?.recruiters || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics?.users?.approvedRecruiters || 0} approved
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
                      <FaUsers className="text-orange-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{analytics?.users?.pendingRecruiters || 0}</p>
                  </div>
                </div>

                {/* Job Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
                      <FaBriefcase className="text-blue-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{analytics?.jobs?.total || 0}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
                      <FaBriefcase className="text-green-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{analytics?.jobs?.active || 0}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                      <FaFileAlt className="text-purple-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{analytics?.applications?.total || 0}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Users</h3>
                    <div className="space-y-3">
                      {analytics?.recent?.users?.length > 0 ? (
                        analytics.recent.users.map((u) => (
                          <div key={u._id} className="flex justify-between items-center py-2 border-b last:border-0">
                            <div>
                              <p className="font-medium text-gray-800">{u.name}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {u.role}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No recent users</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Jobs</h3>
                    <div className="space-y-3">
                      {analytics?.recent?.jobs?.length > 0 ? (
                        analytics.recent.jobs.map((job) => (
                          <div key={job._id} className="py-2 border-b last:border-0">
                            <p className="font-medium text-gray-800">{job.title}</p>
                            <p className="text-sm text-gray-500">{job.companyName}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No recent jobs</p>
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

export default AdminAnalyticsPage;