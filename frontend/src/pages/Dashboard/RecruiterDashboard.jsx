import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyJobs } from '../../redux/slices/jobSlice';
import { logout }      from '../../redux/slices/authSlice';
import Navbar  from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';

const RecruiterDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth);
  const { myJobs, loading } = useSelector((state) => state.job);

  // FIX: useEffect BEFORE any early return (Rules of Hooks)
  // FIX: dependency is user?.isApproved not user (avoids unnecessary refetches)
  useEffect(() => {
    if (user?.isApproved) {
      dispatch(fetchMyJobs());
    }
  }, [user?.isApproved]); // eslint-disable-line react-hooks/exhaustive-deps

  // Early returns AFTER all hooks
  if (!user) return null;

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center bg-white rounded-xl shadow p-12 max-w-md">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Pending Approval</h2>
            <p className="text-gray-600">
              Your recruiter account is awaiting admin approval. You'll receive access once approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Job Postings</h1>
              <button
                onClick={() => navigate('/post-job')}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + Post New Job
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-600">{myJobs?.length || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">
                  {myJobs?.filter((j) => j.isActive).length || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-purple-600">
                  {myJobs?.reduce((sum, job) => sum + (job.applicationsCount || 0), 0) || 0}
                </p>
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            ) : myJobs?.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500 mb-4">No jobs posted yet.</p>
                <button
                  onClick={() => navigate('/post-job')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs?.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl shadow p-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                      <p className="text-gray-500 text-sm">{job.location} • {job.jobType}</p>
                      <p className="text-sm text-gray-400 mt-1">{job.applicationsCount || 0} applications</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;