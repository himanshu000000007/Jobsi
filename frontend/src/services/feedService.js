import api from './api';

const feedService = {
  // Get all posts
  getPosts: async () => {
    return await api.get('/feed/posts');
  },

  // Create a new post
  createPost: async (postData) => {
    return await api.post('/feed/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete a post
  deletePost: async (postId) => {
    return await api.delete(`/feed/posts/${postId}`);
  },

  // Toggle like on a post
  toggleLike: async (postId) => {
    return await api.post(`/feed/posts/${postId}/like`);
  },

  // Add comment to a post
  addComment: async (postId, commentData) => {
    return await api.post(`/feed/posts/${postId}/comments`, commentData);
  },

  // Delete a comment
  deleteComment: async (postId, commentId) => {
    return await api.delete(`/feed/posts/${postId}/comments/${commentId}`);
  },

  // Get user's posts
  getUserPosts: async (userId) => {
    return await api.get(`/feed/posts/user/${userId}`);
  },
};

export default feedService;