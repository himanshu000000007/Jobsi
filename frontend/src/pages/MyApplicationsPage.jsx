import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../redux/slices/jobSlice';
import Navbar  from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

const statusColors = {
  Applied:     'bg-blue-100 text-blue-700',
  Shortlisted: 'bg-yellow-100 text-yellow-700',
  Interview:   'bg-purple-100 text-purple-700',
  Rejected:    'bg-red-100 text-red-700',
  Hired:       'bg-green-100 text-green-700',
};

const MyApplicationsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myApplications, loading } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Applications</h1>

            {loading ? (
              <div className="text-center py-16"><p className="text-gray-500">Loading applications...</p></div>
            ) : myApplications?.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500 mb-2">No applications yet.</p>
                <p className="text-gray-400 text-sm">Browse jobs and apply to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications?.map((app) => (
                  <div key={app._id} className="bg-white rounded-xl shadow p-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{app.jobId?.title || 'Job Title'}</h3>
                      <p className="text-gray-500 text-sm">{app.jobId?.companyName || ''}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {app.status}
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

export default MyApplicationsPage;