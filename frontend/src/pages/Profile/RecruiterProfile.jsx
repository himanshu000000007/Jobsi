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
  FiMapPin,
  FiLinkedin,
  FiGlobe,
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';

const RecruiterProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    company: user?.company || '',
    position: user?.position || '',
    companyWebsite: user?.companyWebsite || '',
    companyDescription: user?.companyDescription || '',
    linkedinProfile: user?.linkedinProfile || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        company: user.company || '',
        position: user.position || '',
        companyWebsite: user.companyWebsite || '',
        companyDescription: user.companyDescription || '',
        linkedinProfile: user.linkedinProfile || '',
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

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.name}
              </h1>
              <p className="text-gray-600 mb-1">
                {user?.position || 'Recruiter'} at {user?.company || 'Company'}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
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
                {user?.location && (
                  <div className="flex items-center space-x-2">
                    <FiMapPin size={16} />
                    <span>{user.location}</span>
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

        {/* Social Links */}
        {(user?.linkedinProfile || user?.companyWebsite) && (
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
            {user.linkedinProfile && (
              <a
                href={user.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <FiLinkedin size={20} />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
            {user.companyWebsite && (
              <a
                href={user.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <FiGlobe size={20} />
                <span className="text-sm">Company Website</span>
              </a>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2 mb-4">
              <FiBriefcase className="text-green-600" />
              <span>Company Information</span>
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="text-gray-900 font-medium">
                  {user?.company || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Position</p>
                <p className="text-gray-900 font-medium">
                  {user?.position || 'Not specified'}
                </p>
              </div>
              {user?.companyDescription && (
                <div>
                  <p className="text-sm text-gray-600">About Company</p>
                  <p className="text-gray-700 mt-1">{user.companyDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recruitment Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2 mb-4">
              <FiTrendingUp className="text-green-600" />
              <span>Recruitment Activity</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Active Job Posts</p>
                  <p className="text-2xl font-bold text-green-600">0</p>
                </div>
                <FiBriefcase size={32} className="text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Applications Received</p>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <FiUsers size={32} className="text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Candidates Hired</p>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                </div>
                <FiCheckCircle size={32} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full" variant="primary">
                Post New Job
              </Button>
              <Button className="w-full" variant="outline">
                View Applications
              </Button>
              <Button className="w-full" variant="outline">
                Manage Jobs
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Completion
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-sm font-medium text-gray-900">80%</p>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Complete your profile to attract better candidates
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
        title="Edit Profile"
        size="lg"
      >
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Personal Information</h4>
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
          <InputField
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />

          <h4 className="font-medium text-gray-900 pt-4">Company Information</h4>
          <InputField
            label="Company Name"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
          <InputField
            label="Your Position"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
          />
          <InputField
            label="Company Website"
            value={formData.companyWebsite}
            onChange={(e) => handleChange('companyWebsite', e.target.value)}
            placeholder="https://company.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              value={formData.companyDescription}
              onChange={(e) => handleChange('companyDescription', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Brief description of your company..."
            />
          </div>

          <h4 className="font-medium text-gray-900 pt-4">Social Links</h4>
          <InputField
            label="LinkedIn Profile"
            value={formData.linkedinProfile}
            onChange={(e) => handleChange('linkedinProfile', e.target.value)}
            placeholder="https://linkedin.com/in/..."
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

export default RecruiterProfile;