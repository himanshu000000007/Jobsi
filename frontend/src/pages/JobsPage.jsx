import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Navbar  from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import api     from '../services/api';
import {
  FaMapMarkerAlt, FaBriefcase, FaExternalLinkAlt,
  FaSearch, FaFilter, FaWifi, FaDollarSign, FaBuilding,
} from 'react-icons/fa';

// ─── Job Type options ─────────────────────────────────────────────────────────
const JOB_TYPES = [
  { label: 'All Types',   value: '' },
  { label: 'Full Time',   value: 'FULLTIME' },
  { label: 'Part Time',   value: 'PARTTIME' },
  { label: 'Contract',    value: 'CONTRACTOR' },
  { label: 'Internship',  value: 'INTERN' },
];

const DATE_POSTED = [
  { label: 'Any Time',    value: '' },
  { label: 'Today',       value: 'today' },
  { label: 'Last 3 Days', value: '3days' },
  { label: 'This Week',   value: 'week' },
  { label: 'This Month',  value: 'month' },
];

// ─── Skeleton loader card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow p-6 animate-pulse">
    <div className="flex gap-4">
      <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-28" />
        </div>
      </div>
      <div className="w-24 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
    </div>
  </div>
);

// ─── Single Job Card ──────────────────────────────────────────────────────────
const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  const salary = job.minSalary && job.maxSalary
    ? `${job.salaryCurrency} ${Number(job.minSalary).toLocaleString()} – ${Number(job.maxSalary).toLocaleString()} / ${job.salaryPeriod || 'yr'}`
    : null;

  const postedAgo = job.postedAt
    ? (() => {
        const diff = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        return `${diff} days ago`;
      })()
    : null;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-all border border-transparent hover:border-blue-100">
      <div className="p-6">
        <div className="flex gap-4 items-start">
          {/* Company Logo */}
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <FaBuilding className="text-gray-400 text-2xl" style={{ display: job.companyLogo ? 'none' : 'block' }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{job.title}</h3>
            <p className="text-blue-600 font-medium text-sm mb-2">{job.company}</p>

            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-blue-400" />
                {job.isRemote ? 'Remote' : job.location}
              </span>
              <span className="flex items-center gap-1">
                <FaBriefcase className="text-blue-400" />
                {job.jobType.replace('_', ' ')}
              </span>
              {job.isRemote && (
                <span className="flex items-center gap-1 text-green-600">
                  <FaWifi /> Remote
                </span>
              )}
              {salary && (
                <span className="flex items-center gap-1 text-green-600">
                  <FaDollarSign />{salary}
                </span>
              )}
              {postedAgo && <span className="text-gray-400">{postedAgo}</span>}
            </div>

            {/* Required Skills from highlights */}
            {job.requiredSkills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.slice(0, 6).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
            >
              Apply Now <FaExternalLinkAlt size={11} />
            </a>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 hover:underline text-center"
            >
              {expanded ? 'Less info ▲' : 'More info ▼'}
            </button>
          </div>
        </div>

        {/* Expandable Description */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {job.highlights?.Qualifications?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Qualifications</p>
                <ul className="list-disc list-inside space-y-1">
                  {job.highlights.Qualifications.map((q, i) => (
                    <li key={i} className="text-sm text-gray-600">{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.highlights?.Responsibilities?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Responsibilities</p>
                <ul className="list-disc list-inside space-y-1">
                  {job.highlights.Responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-gray-600">{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.highlights?.Benefits?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Benefits</p>
                <ul className="list-disc list-inside space-y-1">
                  {job.highlights.Benefits.map((b, i) => (
                    <li key={i} className="text-sm text-gray-600">{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {!job.highlights?.Qualifications?.length && !job.highlights?.Responsibilities?.length && (
              <p className="text-sm text-gray-500 line-clamp-6">{job.description?.slice(0, 600)}...</p>
            )}
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline font-medium">
              View Full Job on {job.publisher} <FaExternalLinkAlt size={11} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const JobsPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [searched,   setSearched]   = useState(false);
  const [page,       setPage]       = useState(1);
  const [hasMore,    setHasMore]    = useState(false);

  const [filters, setFilters] = useState({
    keyword:     '',
    location:    '',
    jobType:     '',
    datePosted:  '',
  });

  const fetchJobs = useCallback(async (searchFilters, pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        query:      searchFilters.keyword || 'developer',
        location:   searchFilters.location,
        page:       pageNum,
        num_pages:  1,
      };
      if (searchFilters.jobType)    params.employment_types = searchFilters.jobType;
      if (searchFilters.datePosted) params.date_posted      = searchFilters.datePosted;

      const res = await api.get('/jsearch/search', { params });

      if (append) {
        setJobs((prev) => [...prev, ...res.data.jobs]);
      } else {
        setJobs(res.data.jobs);
      }
      setHasMore(res.data.jobs.length >= 10);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(filters, 1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(filters, nextPage, true);
  };

  const inputClass = "border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Browse Real Jobs</h1>
              <p className="text-gray-500 text-sm mt-1">Live listings from across the web via JSearch</p>
            </div>

            {/* ── Search & Filters ── */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
              <form onSubmit={handleSearch}>
                {/* Main search row */}
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Job title, keyword, or company"
                      value={filters.keyword}
                      onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                      className={`${inputClass} pl-9 w-full`}
                    />
                  </div>
                  <div className="relative flex-1 min-w-[160px]">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="City, country, or remote"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className={`${inputClass} pl-9 w-full`}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition font-medium flex items-center gap-2">
                    <FaSearch size={13} /> {loading && !jobs.length ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {/* Filter row */}
                <div className="flex flex-wrap gap-3 items-center">
                  <FaFilter className="text-gray-400 text-sm" />
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    className={inputClass}
                  >
                    {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <select
                    value={filters.datePosted}
                    onChange={(e) => setFilters({ ...filters, datePosted: e.target.value })}
                    className={inputClass}
                  >
                    {DATE_POSTED.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  {(filters.keyword || filters.location || filters.jobType || filters.datePosted) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilters({ keyword: '', location: '', jobType: '', datePosted: '' });
                        setJobs([]);
                        setSearched(false);
                      }}
                      className="text-sm text-red-500 hover:text-red-700 transition"
                    >
                      ✕ Clear filters
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ── Results ── */}
            {!searched && !loading && (
              <div className="text-center py-20 bg-white rounded-xl shadow">
                <FaSearch className="mx-auto text-5xl text-gray-200 mb-4" />
                <p className="text-gray-500 text-lg font-medium">Search for jobs to get started</p>
                <p className="text-gray-400 text-sm mt-1">Try "React Developer", "Python Engineer", or "Product Manager"</p>
              </div>
            )}

            {loading && !jobs.length && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium mb-3">{error}</p>
                <button onClick={() => fetchJobs(filters, 1)} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition text-sm">
                  Retry
                </button>
              </div>
            )}

            {searched && !loading && !error && jobs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500 text-lg">No jobs found for your search.</p>
                <p className="text-gray-400 text-sm mt-1">Try broader keywords or a different location.</p>
              </div>
            )}

            {jobs.length > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-4">{jobs.length} jobs found</p>
                <div className="space-y-4">
                  {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg transition font-medium disabled:opacity-60"
                    >
                      {loading ? 'Loading more...' : 'Load More Jobs'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobsPage;