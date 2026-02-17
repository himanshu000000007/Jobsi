const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
  getUserPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// All routes are protected
router.use(protect);

// Post routes
router.post('/', upload.array('images', 5), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Like routes
router.post('/:id/like', toggleLike);

// Comment routes
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);
router.delete('/comments/:id', deleteComment);

// User posts
router.get('/user/:userId', getUserPosts);

module.exports = router;
