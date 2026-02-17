import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, applyForJob } from '../../redux/slices/jobSlice';
import { logout } from '../../redux/slices/authSlice';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import toast from 'react-hot-toast';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.job);
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);

  // ✅ ALL hooks must come before any early returns
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
  });

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Early return AFTER all hooks
  if (authLoading) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchJobs(filters));
  };

  const handleApply = async (jobId) => {
    if (!user?.resume) {
      toast.error('Please upload your resume first');
      return;
    }

    try {
      await dispatch(applyForJob({ jobId, applicationData: {} })).unwrap();
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error || 'Application failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => dispatch(logout())} />

      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Your Dream Job</h1>

            {/* Search Filters */}
            <div className="card mb-8">
              <form onSubmit={handleSearch} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="input-field flex-1"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary">
                  Search Jobs
                </button>
              </form>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No jobs found</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="card hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{job.companyName}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-primary-600" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaBriefcase className="text-primary-600" />
                            {job.jobType}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="text-primary-600" />
                            {job.experienceRequired}+ years
                          </span>
                          <span className="flex items-center gap-1">
                            <FaDollarSign className="text-primary-600" />
                            ${job.salaryRange?.min} - ${job.salaryRange?.max}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired?.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="ml-4">
                        <button
                          onClick={() => handleApply(job._id)}
                          className="btn-primary"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;