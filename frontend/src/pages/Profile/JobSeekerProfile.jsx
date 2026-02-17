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
  FiGithub,
  FiGlobe,
  FiBriefcase,
  FiAward,
  FiBook,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';

const JobSeekerProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    experience: user?.experience || [],
    education: user?.education || [],
    socialLinks: user?.socialLinks || {
      linkedin: '',
      github: '',
      portfolio: '',
    },
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        socialLinks: user.socialLinks || {
          linkedin: '',
          github: '',
          portfolio: '',
        },
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
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

  const openEditModal = (section) => {
    setEditSection(section);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.name}
              </h1>
              <p className="text-gray-600 mb-3">{user?.bio || 'Job Seeker'}</p>
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
            onClick={() => openEditModal('basic')}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <FiEdit2 size={16} />
            <span>Edit Profile</span>
          </Button>
        </div>

        {/* Social Links */}
        {(user?.socialLinks?.linkedin ||
          user?.socialLinks?.github ||
          user?.socialLinks?.portfolio) && (
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
            {user.socialLinks.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <FiLinkedin size={20} />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
            {user.socialLinks.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <FiGithub size={20} />
                <span className="text-sm">GitHub</span>
              </a>
            )}
            {user.socialLinks.portfolio && (
              <a
                href={user.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
              >
                <FiGlobe size={20} />
                <span className="text-sm">Portfolio</span>
              </a>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiAward className="text-blue-600" />
                <span>Skills</span>
              </h2>
              <button
                onClick={() => openEditModal('skills')}
                className="text-blue-600 hover:text-blue-700"
              >
                <FiEdit2 size={18} />
              </button>
            </div>
            {user?.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiBriefcase className="text-blue-600" />
                <span>Experience</span>
              </h2>
              <button
                onClick={() => openEditModal('experience')}
                className="text-blue-600 hover:text-blue-700"
              >
                <FiEdit2 size={18} />
              </button>
            </div>
            {user?.experience && user.experience.length > 0 ? (
              <div className="space-y-4">
                {user.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No experience added yet</p>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiBook className="text-blue-600" />
                <span>Education</span>
              </h2>
              <button
                onClick={() => openEditModal('education')}
                className="text-blue-600 hover:text-blue-700"
              >
                <FiEdit2 size={18} />
              </button>
            </div>
            {user?.education && user.education.length > 0 ? (
              <div className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No education added yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Profile Completeness</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">75% Complete</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Applications</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Saved Jobs</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editSection === 'basic' ? 'Profile' : editSection}`}
        size="lg"
      >
        <div className="space-y-4">
          {editSection === 'basic' && (
            <>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Social Links</h4>
                <InputField
                  label="LinkedIn"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) =>
                    handleSocialLinkChange('linkedin', e.target.value)
                  }
                  placeholder="https://linkedin.com/in/..."
                />
                <InputField
                  label="GitHub"
                  value={formData.socialLinks.github}
                  onChange={(e) =>
                    handleSocialLinkChange('github', e.target.value)
                  }
                  placeholder="https://github.com/..."
                />
                <InputField
                  label="Portfolio"
                  value={formData.socialLinks.portfolio}
                  onChange={(e) =>
                    handleSocialLinkChange('portfolio', e.target.value)
                  }
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </>
          )}

          {editSection === 'skills' && (
            <>
              <div className="flex space-x-2">
                <InputField
                  label="Add Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="flex-1"
                />
                <Button onClick={handleAddSkill} className="mt-8">
                  <FiPlus size={20} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </>
          )}

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

export default JobSeekerProfile;