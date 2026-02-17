// Backend Feed Routes - Define API endpoints for social feed functionality
// Place this file in: backend/src/routes/feedRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getUserPosts,
} = require('../controllers/feedController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

// @route   GET /api/feed/posts
// @desc    Get all posts
// @access  Private
router.get('/posts', protect, getPosts);

// @route   POST /api/feed/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', protect, upload.single('image'), createPost);

// @route   DELETE /api/feed/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/posts/:id', protect, deletePost);

// @route   POST /api/feed/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/posts/:id/like', protect, toggleLike);

// @route   POST /api/feed/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.post('/posts/:id/comments', protect, addComment);

// @route   DELETE /api/feed/posts/:postId/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/posts/:postId/comments/:commentId', protect, deleteComment);

// @route   GET /api/feed/posts/user/:userId
// @desc    Get posts by specific user
// @access  Private
router.get('/posts/user/:userId', protect, getUserPosts);

module.exports = router;