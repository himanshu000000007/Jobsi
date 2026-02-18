import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar  from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import api     from '../../services/api';
import toast   from 'react-hot-toast';

const AdminUsersPage = () => {
  const { user }             = useSelector((state) => state.auth);
  const [users,    setUsers]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users || res.data);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      setUsers(users.filter((u) => u._id !== userId));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  // FIX Bug 2: correct API endpoint + payload for recruiter approval
  // Backend expects: PUT /api/admin/recruiters/:id/approve  { isApproved: true/false }
  const handleApproveRecruiter = async (recruiterId, approve) => {
    try {
      await api.put(`/admin/recruiters/${recruiterId}/approve`, { isApproved: approve });
      toast.success(approve ? '✅ Recruiter approved!' : '❌ Recruiter rejected');
      fetchUsers(); // refresh list
    } catch (err) {
      console.error('Approve error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  // FIX Bug 2: role comparison — backend stores 'RECRUITER' (uppercase)
  // Check both cases to be safe
  const isRecruiter = (u) =>
    u.role?.toUpperCase() === 'RECRUITER';

  const isPendingRecruiter = (u) =>
    isRecruiter(u) && !u.isApproved;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
              <div className="flex gap-3">
                {/* Pending badge */}
                {users.filter(isPendingRecruiter).length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                    ⏳ {users.filter(isPendingRecruiter).length} Pending Approval
                  </span>
                )}
                <button onClick={fetchUsers} className="text-sm bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">
                  🔄 Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16"><p className="text-gray-500">Loading users...</p></div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-3">{error}</p>
                <button onClick={fetchUsers} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">Retry</button>
              </div>
            ) : (
              <>
                {/* Pending Recruiters — highlighted section at top */}
                {users.filter(isPendingRecruiter).length > 0 && (
                  <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-yellow-800 mb-3">⏳ Recruiters Awaiting Approval</h2>
                    <div className="space-y-2">
                      {users.filter(isPendingRecruiter).map((u) => (
                        <div key={u._id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
                          <div>
                            <p className="font-medium text-gray-800">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email} • {u.companyName || 'No company'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRecruiter(u._id, true)}
                              className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleApproveRecruiter(u._id, false)}
                              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Users Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Role</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                          <td className="px-6 py-4 text-gray-500">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.role?.toUpperCase() === 'ADMIN'     ? 'bg-purple-100 text-purple-700' :
                              u.role?.toUpperCase() === 'RECRUITER' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                              {isRecruiter(u) && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isApproved ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {u.isApproved ? 'Approved' : 'Pending'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleToggleActive(u._id)}
                                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                              >
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              {/* FIX: show approve/reject for ALL pending recruiters */}
                              {isPendingRecruiter(u) && (
                                <>
                                  <button
                                    onClick={() => handleApproveRecruiter(u._id, true)}
                                    className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => handleApproveRecruiter(u._id, false)}
                                    className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                  >
                                    ✕ Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(u._id)}
                                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No users found.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;