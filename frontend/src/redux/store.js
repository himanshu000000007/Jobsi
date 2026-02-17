import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import feedReducer from './slices/feedSlice';
import resumeReducer from './slices/resumeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    feed: feedReducer,
    resume: resumeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
