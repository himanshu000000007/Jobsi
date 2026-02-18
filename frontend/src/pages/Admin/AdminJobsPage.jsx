import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar  from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import api     from '../../services/api';
import toast   from 'react-hot-toast';

const AdminJobsPage = () => {
  const { user }             = useSelector((state) => state.auth);
  const [jobs,    setJobs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]  = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setError(null);
      const res = await api.get('/admin/jobs');
      setJobs(res.data.jobs || res.data);
    } catch {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted');
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Jobs</h1>

            {loading ? (
              <div className="text-center py-16"><p className="text-gray-500">Loading jobs...</p></div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-3">{error}</p>
                <button onClick={() => { setLoading(true); fetchJobs(); }} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">Retry</button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Title</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Company</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Location</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Applications</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                        <td className="px-6 py-4 text-gray-500">{job.companyName}</td>
                        <td className="px-6 py-4 text-gray-500">{job.location}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {job.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{job.applicationsCount || 0}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(job._id)} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {jobs.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No jobs found.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminJobsPage;