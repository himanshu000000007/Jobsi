// frontend/src/redux/slices/feedSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedService from '../../services/feedService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchPosts = createAsyncThunk(
  'feed/fetchPosts',
  async (page = 1, thunkAPI) => {
    try {
      return await feedService.getPosts(page);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (postData, thunkAPI) => {
    try {
      return await feedService.createPost(postData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  'feed/deletePost',
  async (postId, thunkAPI) => {
    try {
      await feedService.deletePost(postId);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const toggleLike = createAsyncThunk(
  'feed/toggleLike',
  async (postId, thunkAPI) => {
    try {
      return await feedService.toggleLike(postId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const addComment = createAsyncThunk(
  'feed/addComment',
  async ({ postId, content }, thunkAPI) => {
    try {
      const data = await feedService.addComment(postId, content);
      return { postId, comment: data.comment || data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchComments = createAsyncThunk(
  'feed/fetchComments',
  async (postId, thunkAPI) => {
    try {
      const data = await feedService.getComments(postId);
      return { postId, comments: data.comments || data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    posts:      [],
    loading:    false,
    error:      null,
    hasMore:    true,
    page:       1,
    creating:   false,
  },
  reducers: {
    resetFeed: (state) => {
      state.posts   = [];
      state.page    = 1;
      state.hasMore = true;
      state.error   = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = action.payload.posts || action.payload || [];
        if (action.meta.arg === 1) {
          state.posts = incoming;           // fresh load
        } else {
          // append for pagination
          const existingIds = new Set(state.posts.map((p) => p._id));
          state.posts.push(...incoming.filter((p) => !existingIds.has(p._id)));
        }
        state.hasMore = incoming.length >= 10;
        state.page    = action.meta.arg || 1;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // createPost
      .addCase(createPost.pending, (state) => {
        state.creating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        const newPost  = action.payload.post || action.payload;
        state.posts.unshift(newPost); // add to top of feed
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error    = action.payload;
      })

      // deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })

      // toggleLike — backend returns { isLiked, likesCount } not a full post
      // So we update those two fields on the matching post in state
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { isLiked, likesCount } = action.payload;
        const postId = action.meta.arg; // postId was passed as the thunk argument
        const post   = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isLiked    = isLiked;
          post.likesCount = likesCount;
        }
      })

      // addComment — add comment to the right post
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
          post.commentsCount = (post.commentsCount || 0) + 1;
        }
      })

      // fetchComments — attach to post
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) post.comments = comments;
      });
  },
});

export const { resetFeed, clearError } = feedSlice.actions;
export default feedSlice.reducer;