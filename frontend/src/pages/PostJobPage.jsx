import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../redux/slices/jobSlice';
import Navbar  from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import toast   from 'react-hot-toast';

const PostJobPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.job);

  const [formData, setFormData] = useState({
    title:               '',
    description:         '',
    location:            '',
    jobType:             'Full-time',
    experienceRequired:  0,
    salaryMin:           '',
    salaryMax:           '',
    skillsRequired:      '',
    applicationDeadline: '',
    numberOfOpenings:    1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      title:              formData.title,
      description:        formData.description,
      location:           formData.location,
      jobType:            formData.jobType,
      experienceRequired: Number(formData.experienceRequired),
      salaryRange: {
        min: Number(formData.salaryMin),
        max: Number(formData.salaryMax),
      },
      skillsRequired:      formData.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
      applicationDeadline: formData.applicationDeadline,
      numberOfOpenings:    Number(formData.numberOfOpenings),
    };

    try {
      await dispatch(createJob(jobData)).unwrap();
      toast.success('Job posted successfully!');
      navigate('/my-jobs');
    } catch (err) {
      toast.error(err || 'Failed to post job');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Post a New Job</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Senior React Developer" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={inputClass} placeholder="Describe the role, responsibilities, and requirements..." required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Bangalore, Remote" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                  <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputClass}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($)</label>
                  <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className={inputClass} placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary ($)</label>
                  <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className={inputClass} placeholder="e.g. 80000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input type="number" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} min={0} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required</label>
                <input name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} className={inputClass} placeholder="React, Node.js, MongoDB (comma separated)" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Openings</label>
                  <input type="number" name="numberOfOpenings" value={formData.numberOfOpenings} onChange={handleChange} min={1} className={inputClass} />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition font-medium">
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
                <button type="button" onClick={() => navigate('/my-jobs')} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostJobPage;