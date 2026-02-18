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

// ✅ FIX: postController uses req.files[0] so keep upload.array
// but also handle single file gracefully in controller
router.post('/', upload.array('images', 5), createPost);
router.get('/', getAllPosts);

// ✅ IMPORTANT: Static routes BEFORE dynamic /:id routes
router.get('/user/:userId', getUserPosts);          // must be before /:id
router.delete('/comments/:id', deleteComment);      // must be before /:id

router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Like routes
router.post('/:id/like', toggleLike);

// Comment routes
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

module.exports = router;