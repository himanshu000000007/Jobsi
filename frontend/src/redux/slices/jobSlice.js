import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';

// Initial state
const initialState = {
  jobs: [],
  currentJob: null,
  myJobs: [],
  applications: [],
  myApplications: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await jobService.getAllJobs(filters);
      return data;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch jobs'
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'job/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await jobService.getJobById(id);
      return data.job;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch job'
      );
    }
  }
);

export const createJob = createAsyncThunk(
  'job/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const data = await jobService.createJob(jobData);
      return data.job;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create job'
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const data = await jobService.updateJob(id, jobData);
      return data.job;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update job'
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(id);
      return id;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete job'
      );
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'job/fetchMyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobService.getMyJobs();
      return data.jobs;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch jobs'
      );
    }
  }
);

export const applyForJob = createAsyncThunk(
  'job/applyForJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const data = await jobService.applyForJob(jobId, applicationData);
      return data.application;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to apply'
      );
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'job/fetchJobApplications',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await jobService.getJobApplications(jobId);
      return data.applications;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch applications'
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'job/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobService.getMyApplications();
      return data.applications;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch applications'
      );
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'job/updateApplicationStatus',
  async ({ applicationId, statusData }, { rejectWithValue }) => {
    try {
      const data = await jobService.updateApplicationStatus(applicationId, statusData);
      return data.application;
    } catch (error) {
      // ✅ Standardized error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update status'
      );
    }
  }
);

// Slice
const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Jobs ───
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch Job By ID ───
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Create Job ───
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Update Job ───
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myJobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.myJobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Delete Job ───
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = state.myJobs.filter(job => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch My Jobs ───
      .addCase(fetchMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Apply For Job ───
      // ✅ FIX BUG 2: Added missing handler for applyForJob
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new application to myApplications list
        state.myApplications.unshift(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch Job Applications ───
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch My Applications ───
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Update Application Status ───
      // ✅ FIX BUG 2: Added missing handler for updateApplicationStatus
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApp = action.payload;

        // Update in applications list (recruiter view)
        const appIndex = state.applications.findIndex(
          app => app._id === updatedApp._id
        );
        if (appIndex !== -1) {
          state.applications[appIndex] = updatedApp;
        }

        // Update in myApplications list (job seeker view)
        const myAppIndex = state.myApplications.findIndex(
          app => app._id === updatedApp._id
        );
        if (myAppIndex !== -1) {
          state.myApplications[myAppIndex] = updatedApp;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;