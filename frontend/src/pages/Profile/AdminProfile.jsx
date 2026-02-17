import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import InputField from '../../components/Common/InputField';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiShield,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
} from 'react-icons/fi';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Mock stats - these would come from your backend
  const stats = {
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    systemHealth: 'Good',
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <FiShield size={12} />
                  <span>ADMIN</span>
                </span>
              </div>
              <p className="text-gray-600 mb-3">System Administrator</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {user?.email && (
                  <div className="flex items-center space-x-2">
                    <FiMail size={16} />
                    <span>{user.email}</span>
                  </div>
                )}
                {user?.phone && (
                  <div className="flex items-center space-x-2">
                    <FiPhone size={16} />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <FiEdit2 size={16} />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers size={24} className="text-blue-600" />
              </div>
              <FiTrendingUp size={20} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiBriefcase size={24} className="text-purple-600" />
              </div>
              <FiTrendingUp size={20} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
            <p className="text-xs text-green-600 mt-2">+8% from last month</p>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiFileText size={24} className="text-green-600" />
              </div>
              <FiTrendingUp size={20} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
            <p className="text-xs text-green-600 mt-2">+15% from last month</p>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiActivity size={24} className="text-green-600" />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                Operational
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">System Health</p>
            <p className="text-3xl font-bold text-gray-900">{stats.systemHealth}</p>
            <p className="text-xs text-gray-500 mt-2">All systems operational</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Capabilities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FiShield className="text-red-600" />
              <span>Admin Capabilities</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition cursor-pointer">
                <FiUsers size={20} className="text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
                <p className="text-sm text-gray-600">
                  Manage users, roles, and permissions
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition cursor-pointer">
                <FiBriefcase size={20} className="text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Job Management</h3>
                <p className="text-sm text-gray-600">
                  Oversee all job postings and applications
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition cursor-pointer">
                <FiFileText size={20} className="text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Content Moderation</h3>
                <p className="text-sm text-gray-600">
                  Review and moderate platform content
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition cursor-pointer">
                <FiActivity size={20} className="text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">
                  View detailed platform analytics
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Admin Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded">
                  <FiUsers size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">
                    No recent activity
                  </p>
                  <p className="text-xs text-gray-500">System initialized</p>
                </div>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full" variant="primary">
                <FiUsers className="mr-2" />
                Manage Users
              </Button>
              <Button className="w-full" variant="outline">
                <FiBriefcase className="mr-2" />
                View All Jobs
              </Button>
              <Button className="w-full" variant="outline">
                <FiFileText className="mr-2" />
                View Reports
              </Button>
              <Button className="w-full" variant="outline">
                <FiActivity className="mr-2" />
                System Logs
              </Button>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FiAlertCircle className="text-orange-600" />
              <span>System Alerts</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  All Systems Operational
                </p>
                <p className="text-xs text-green-600 mt-1">
                  No alerts at this time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Admin Profile"
        size="md"
      >
        <div className="space-y-4">
          <InputField
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <InputField
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => setIsEditModalOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} loading={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProfile;