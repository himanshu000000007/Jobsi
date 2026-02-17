import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from '../../services/resumeService';

// Async thunks
export const fetchResumes = createAsyncThunk(
  'resume/fetchResumes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeService.getResumes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resumes');
    }
  }
);

export const saveResume = createAsyncThunk(
  'resume/saveResume',
  async (resumeData, { rejectWithValue }) => {
    try {
      const response = await resumeService.createResume(resumeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save resume');
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/updateResume',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await resumeService.updateResume(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update resume');
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/deleteResume',
  async (id, { rejectWithValue }) => {
    try {
      await resumeService.deleteResume(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resume');
    }
  }
);

export const analyzeResume = createAsyncThunk(
  'resume/analyzeResume',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await resumeService.analyzeResume(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to analyze resume');
    }
  }
);

// Initial state
const initialState = {
  resumes: [],
  currentResume: null,
  atsResult: null,
  loading: false,
  error: null,
};

// Slice
const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearATSResult: (state) => {
      state.atsResult = null;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Resumes
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save Resume
      .addCase(saveResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.push(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Resume
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.resumes.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
        state.currentResume = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
        }
      })
      
      // Analyze Resume
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.atsResult = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.atsResult = action.payload;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearATSResult, setCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;