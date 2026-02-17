import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs } from '../../redux/slices/jobSlice';
import { logout } from '../../redux/slices/authSlice';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myJobs, loading } = useSelector((state) => state.job);

  // ✅ ALL hooks must come before any early returns
  useEffect(() => {
    if (user?.isApproved) {
      dispatch(fetchMyJobs());
    }
  }, [user?.isApproved]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Early returns AFTER all hooks
  if (!user) return null;

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={() => dispatch(logout())} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Pending Approval
            </h2>
            <p className="text-gray-600">
              Your recruiter account is awaiting admin approval.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => dispatch(logout())} />

      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Job Postings</h1>
              <button className="btn-primary">Create New Job</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Total Jobs</p>
                <p className="text-3xl font-bold text-primary-600">
                  {myJobs?.length || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">
                  {myJobs?.filter((j) => j.isActive).length || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Total Applications</p>
                <p className="text-3xl font-bold text-blue-600">
                  {myJobs?.reduce((sum, job) => sum + (job.applicationsCount || 0), 0) || 0}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs?.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No jobs posted yet</p>
                  </div>
                ) : (
                  myJobs?.map((job) => (
                    <div key={job._id} className="card">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-4">
                        {job.location} • {job.jobType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {job.applicationsCount || 0} applications
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;