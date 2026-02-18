// backend/routes/jobSearchRoutes.js
// Proxies requests to JSearch (RapidAPI) so the API key stays server-side only

const express = require('express');
const axios   = require('axios');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');

const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com';

// GET /api/jsearch/search?query=react+developer&location=india&page=1&num_pages=1
router.get('/search', protect, async (req, res) => {
  try {
    // ✅ FIX: Check if API key exists before calling JSearch
    const apiKey = process.env.JSEARCH_API_KEY;

    if (!apiKey) {
      console.warn('⚠️  JSEARCH_API_KEY not set in .env — returning empty external jobs');
      return res.json({
        status: 'OK',
        totalCount: 0,
        page: 1,
        jobs: [],
        message: 'External job search not configured. Add JSEARCH_API_KEY to .env',
      });
    }

    const {
      query            = 'developer',
      location         = '',
      page             = 1,
      num_pages        = 1,
      date_posted      = '',       // 'all' | 'today' | '3days' | 'week' | 'month'
      employment_types = '',       // 'FULLTIME,PARTTIME,CONTRACTOR,INTERN'
      experience       = '',       // 'no_experience','under_3_years_experience'
    } = req.query;

    const params = {
      query:     location ? `${query} in ${location}` : query,
      page:      String(page),
      num_pages: String(num_pages),
    };

    if (date_posted)      params.date_posted      = date_posted;
    if (employment_types) params.employment_types = employment_types;
    if (experience)       params.job_requirements = experience;

    const jsearchHeaders = {
      'x-rapidapi-key':  apiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    };

    const response = await axios.get(`${JSEARCH_BASE}/search`, {
      params,
      headers: jsearchHeaders,
      timeout: 10000,
    });

    // Shape the response for the frontend
    const jobs = (response.data.data || []).map((job) => ({
      id:             job.job_id,
      title:          job.job_title,
      company:        job.employer_name,
      companyLogo:    job.employer_logo || null,
      location:       job.job_city
        ? `${job.job_city}${job.job_country ? ', ' + job.job_country : ''}`
        : job.job_country || 'Remote',
      isRemote:       job.job_is_remote,
      jobType:        job.job_employment_type || 'Full-time',
      description:    job.job_description,
      applyLink:      job.job_apply_link,
      minSalary:      job.job_min_salary    || null,
      maxSalary:      job.job_max_salary    || null,
      salaryCurrency: job.job_salary_currency || 'USD',
      salaryPeriod:   job.job_salary_period  || null,
      postedAt:       job.job_posted_at_datetime_utc || null,
      expiresAt:      job.job_offer_expiration_datetime_utc || null,
      requiredSkills: job.job_required_skills || [],
      highlights:     job.job_highlights     || {},
      publisher:      job.job_publisher      || '',
    }));

    res.json({
      status:     'OK',
      totalCount: jobs.length,
      page:       Number(page),
      jobs,
    });

  } catch (error) {
    console.error('JSearch error:', error.response?.data || error.message);

    // ✅ FIX: Don't crash with 500 — return empty array with message
    // so frontend shows "no external jobs" instead of breaking
    const status = error.response?.status;

    if (status === 429) {
      return res.json({ status: 'OK', totalCount: 0, page: 1, jobs: [],
        message: 'External job API rate limit reached. Try again later.' });
    }

    if (status === 401 || status === 403) {
      return res.json({ status: 'OK', totalCount: 0, page: 1, jobs: [],
        message: 'Invalid JSEARCH_API_KEY. Check your .env file.' });
    }

    // For any other error, still return empty instead of crashing
    res.json({
      status: 'OK',
      totalCount: 0,
      page: 1,
      jobs: [],
      message: 'External job search temporarily unavailable.',
    });
  }
});

module.exports = router;