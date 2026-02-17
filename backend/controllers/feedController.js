// Backend Feed Controller - Handles feed-related API logic
// Place this file in: backend/src/controllers/feedController.js

const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary'); // Optional: for image upload

/**
 * @desc    Get all posts
 * @route   GET /api/feed/posts
 * @access  Private
 */
const getPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .populate('likes', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500);
    throw new Error('Failed to fetch posts');
  }
});

/**
 * @desc    Create a new post
 * @route   POST /api/feed/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    if (!content && !req.file) {
      res.status(400);
      throw new Error('Post must have content or an image');
    }

    let imageUrl = null;

    // Upload image to cloudinary if exists
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const post = await Post.create({
      author: req.user._id,
      content: content || '',
      image: imageUrl,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .populate('likes', 'name avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500);
    throw new Error('Failed to create post');
  }
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/feed/posts/:id
 * @access  Private
 */
const deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    // Delete image from cloudinary if exists
    if (post.image) {
      await deleteImage(post.image);
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500);
    throw new Error('Failed to delete post');
  }
});

/**
 * @desc    Toggle like on a post
 * @route   POST /api/feed/posts/:id/like
 * @access  Private
 */
const toggleLike = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .populate('likes', 'name avatar');

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500);
    throw new Error('Failed to toggle like');
  }
});

/**
 * @desc    Add comment to a post
 * @route   POST /api/feed/posts/:id/comments
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400);
      throw new Error('Comment content is required');
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = {
      user: req.user._id,
      content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .populate('likes', 'name avatar');

    // Return the newly added comment
    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500);
    throw new Error('Failed to add comment');
  }
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/feed/posts/:postId/comments/:commentId
 * @access  Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Check if user is the comment author
    if (comment.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500);
    throw new Error('Failed to delete comment');
  }
});

/**
 * @desc    Get posts by specific user
 * @route   GET /api/feed/posts/user/:userId
 * @access  Private
 */
const getUserPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .populate('likes', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get User Posts Error:', error);
    res.status(500);
    throw new Error('Failed to fetch user posts');
  }
});

/**
 * Helper function to upload image to cloudinary
 */
const uploadImage = async (file) => {
  try {
    // If using cloudinary
    if (cloudinary) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'job-portal/feed',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      return result.secure_url;
    }

    // Alternative: Save locally (for development)
    // const fileName = `${Date.now()}-${file.originalname}`;
    // const filePath = path.join(__dirname, '../../uploads/feed', fileName);
    // await fs.promises.writeFile(filePath, file.buffer);
    // return `/uploads/feed/${fileName}`;

    return null;
  } catch (error) {
    console.error('Image Upload Error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Helper function to delete image from cloudinary
 */
const deleteImage = async (imageUrl) => {
  try {
    if (cloudinary && imageUrl) {
      // Extract public_id from URL
      const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Image Delete Error:', error);
    // Don't throw error, just log it
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getUserPosts,
};