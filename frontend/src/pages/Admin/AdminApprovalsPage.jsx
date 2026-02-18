import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar  from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import api     from '../../services/api';
import toast   from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const AdminApprovalsPage = () => {
  const { user }           = useSelector((state) => state.auth);
  const [recruiters, setRecruiters] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [submitting, setSubmitting] = useState(null); // ID of recruiter being processed

  useEffect(() => { fetchPendingRecruiters(); }, []);

  const fetchPendingRecruiters = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // FIX: Use dedicated backend endpoint instead of fetching all users
      const res = await api.get('/admin/recruiters/pending');
      setRecruiters(res.data.recruiters || []);
    } catch (err) {
      setError('Failed to load pending recruiters.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recruiterId, approve) => {
    setSubmitting(recruiterId);
    try {
      await api.put(`/admin/recruiters/${recruiterId}/approve`, { isApproved: approve });
      toast.success(approve ? '✅ Recruiter approved!' : '❌ Recruiter rejected');
      
      // FIX: Refetch entire list from server instead of just removing from UI
      // This ensures refresh shows correct state
      await fetchPendingRecruiters();
    } catch (err) {
      console.error('Approve error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Recruiter Approvals</h1>
                <p className="text-gray-500 text-sm mt-1">Review and approve pending recruiter accounts</p>
              </div>
              <button 
                onClick={fetchPendingRecruiters} 
                className="text-sm bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <FaSpinner className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                <p className="text-gray-500">Loading pending recruiters...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-3">{error}</p>
                <button 
                  onClick={fetchPendingRecruiters} 
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : recruiters.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow">
                <FaCheckCircle className="text-green-400 mx-auto mb-4" size={48} />
                <p className="text-gray-500 text-lg font-medium">No pending approvals</p>
                <p className="text-gray-400 text-sm mt-1">All recruiters have been reviewed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recruiters.map((recruiter) => (
                  <div 
                    key={recruiter._id} 
                    className="bg-white rounded-xl shadow hover:shadow-md transition p-6 border-l-4 border-yellow-400"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-lg">
                            {recruiter.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{recruiter.name}</h3>
                            <p className="text-sm text-gray-500">{recruiter.email}</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            ⏳ Pending
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {recruiter.companyName && (
                            <div>
                              <span className="text-gray-400 block mb-1">Company</span>
                              <span className="text-gray-700 font-medium">{recruiter.companyName}</span>
                            </div>
                          )}
                          {recruiter.companyWebsite && (
                            <div>
                              <span className="text-gray-400 block mb-1">Website</span>
                              <a 
                                href={recruiter.companyWebsite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {recruiter.companyWebsite}
                              </a>
                            </div>
                          )}
                          {recruiter.phone && (
                            <div>
                              <span className="text-gray-400 block mb-1">Phone</span>
                              <span className="text-gray-700">{recruiter.phone}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-400 block mb-1">Registered</span>
                            <span className="text-gray-700">
                              {new Date(recruiter.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {recruiter.companyDescription && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-400 block mb-1">About Company</span>
                            <p className="text-sm text-gray-600">{recruiter.companyDescription}</p>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex flex-col gap-2">
                        <button
                          onClick={() => handleApprove(recruiter._id, true)}
                          disabled={submitting === recruiter._id}
                          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium min-w-[120px] justify-center"
                        >
                          {submitting === recruiter._id ? (
                            <FaSpinner className="animate-spin" size={14} />
                          ) : (
                            <FaCheckCircle size={14} />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprove(recruiter._id, false)}
                          disabled={submitting === recruiter._id}
                          className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 disabled:opacity-50 transition font-medium min-w-[120px] justify-center"
                        >
                          {submitting === recruiter._id ? (
                            <FaSpinner className="animate-spin" size={14} />
                          ) : (
                            <FaTimesCircle size={14} />
                          )}
                          Reject
                        </button>
                      </div>
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

export default AdminApprovalsPage;