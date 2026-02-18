import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyJobs } from '../redux/slices/jobSlice';
import Navbar  from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

const MyJobsPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth);
  const { myJobs, loading } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Jobs</h1>
              <button onClick={() => navigate('/post-job')} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                + Post New Job
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16"><p className="text-gray-500">Loading...</p></div>
            ) : myJobs?.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500 mb-4">No jobs posted yet.</p>
                <button onClick={() => navigate('/post-job')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs?.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-gray-500 text-sm">{job.location} • {job.jobType}</p>
                      <p className="text-gray-400 text-xs mt-1">{job.applicationsCount || 0} applications</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
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

export default MyJobsPage;