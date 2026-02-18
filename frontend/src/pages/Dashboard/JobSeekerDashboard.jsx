import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, applyForJob } from '../../redux/slices/jobSlice';
import { logout } from '../../redux/slices/authSlice';
import Navbar   from '../../components/Layout/Navbar';
import Sidebar  from '../../components/Layout/Sidebar';
import toast    from 'react-hot-toast';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const { jobs, loading }           = useSelector((state) => state.job);
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);

  // FIX: ALL hooks declared before any early return (Rules of Hooks)
  const [filters, setFilters] = useState({ keyword: '', location: '' });

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Early return AFTER all hooks
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchJobs(filters));
  };

  const handleApply = async (jobId) => {
    // FIX: optional chaining — user?.resume instead of user.resume
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
      <Navbar />

      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Your Dream Job</h1>

            {/* Search */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Search Jobs
                </button>
              </form>
            </div>

            {/* Jobs */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading jobs...</p>
                </div>
              ) : jobs?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No jobs found. Try different keywords.</p>
                </div>
              ) : (
                jobs?.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                        <p className="text-gray-600 mb-3">{job.companyName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-500" />{job.location}</span>
                          <span className="flex items-center gap-1"><FaBriefcase className="text-blue-500" />{job.jobType}</span>
                          <span className="flex items-center gap-1"><FaClock className="text-blue-500" />{job.experienceRequired}+ yrs</span>
                          <span className="flex items-center gap-1"><FaDollarSign className="text-blue-500" />${job.salaryRange?.min} - ${job.salaryRange?.max}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleApply(job._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
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