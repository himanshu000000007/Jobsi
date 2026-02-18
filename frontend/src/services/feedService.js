// frontend/src/services/feedService.js
import api from './api';

// FIX: Backend route is /api/posts (registered as app.use('/api/posts', postRoutes))
// NOT /api/feed/posts — that was causing 404

const getPosts = async (page = 1) => {
  const response = await api.get(`/posts?page=${page}&limit=10`);
  return response.data;
};

const createPost = async (postData) => {
  // Handle both FormData (with images) and plain object
  const config = postData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await api.post('/posts', postData, config);
  return response.data;
};

const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

const updatePost = async (postId, postData) => {
  const response = await api.put(`/posts/${postId}`, postData);
  return response.data;
};

const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

const toggleLike = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

const addComment = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  return response.data;
};

const getComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await api.delete(`/posts/comments/${commentId}`);
  return response.data;
};

const getUserPosts = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

const feedService = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
  getUserPosts,
};

export default feedService;