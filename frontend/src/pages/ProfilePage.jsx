import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import Navbar  from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import toast   from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ProfilePage = () => {
  const dispatch   = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name:        user?.name        || '',
    phone:       user?.phone       || '',
    location:    user?.location    || '',
    bio:         user?.bio         || '',
    skills:      user?.skills?.join(', ') || '',
    experience:  user?.experience  || 0,
    // Recruiter fields
    companyName:        user?.companyName        || '',
    companyWebsite:     user?.companyWebsite     || '',
    companyDescription: user?.companyDescription || '',
  });

  const normalizeRole = (role = '') => role.toLowerCase().replace('_', '');
  const role = normalizeRole(user?.role);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = {
      ...formData,
      skills:     formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      experience: Number(formData.experience),
    };
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

            {/* Avatar */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-500">{user?.email}</p>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full mt-1 inline-block">{user?.role}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="name" value={formData.name} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Your name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="phone" value={formData.phone} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="location" value={formData.location} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="City, Country" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className={inputClass} placeholder="Tell us about yourself..." />
              </div>

              {/* Job Seeker fields */}
              {role === 'jobseeker' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
                    <input name="skills" value={formData.skills} onChange={handleChange} className={inputClass} placeholder="React, Node.js, Python" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} min={0} className={inputClass} />
                  </div>
                </>
              )}

              {/* Recruiter fields */}
              {role === 'recruiter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                    <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className={inputClass} placeholder="https://company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                    <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows={3} className={inputClass} placeholder="About your company..." />
                  </div>
                </>
              )}

              <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition font-medium">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;