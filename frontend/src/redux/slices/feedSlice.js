import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedService from '../../services/feedService';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'feed/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await feedService.getPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await feedService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'feed/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await feedService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'feed/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await feedService.toggleLike(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const addComment = createAsyncThunk(
  'feed/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await feedService.addComment(postId, { content });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'feed/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await feedService.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Slice
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload.postId);
        if (index !== -1) {
          state.posts[index].comments.push(action.payload.comment);
        }
      })
      
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const postIndex = state.posts.findIndex((post) => post._id === action.payload.postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
            (comment) => comment._id !== action.payload.commentId
          );
        }
      });
  },
});

export const { clearError } = feedSlice.actions;
export default feedSlice.reducer;