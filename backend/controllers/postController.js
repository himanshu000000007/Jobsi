// backend/controllers/postController.js
// FIXED: Aligned with Post.js model which uses:
//   - author (not userId)
//   - likes: [ObjectId]  (array, no separate Like model)
//   - comments: embedded subdocuments with 'user' field (no separate Comment model)
//   - image: String (single)
//   - NO isActive field
//   - NO likesCount / commentsCount (computed from arrays)

const Post       = require('../models/Post');
const cloudinary = require('../config/cloudinary');

// ─── @desc   Create a new post
// ─── @route  POST /api/posts
// ─── @access Private
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let image = null;

    if (req.files && req.files.length > 0) {
      image = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'job-portal/posts', resource_type: 'auto' },
          (err, result) => (err ? reject(err) : resolve(result.secure_url))
        );
        stream.end(req.files[0].buffer);
      });
    }

    const post = await Post.create({ author: req.user._id, content, image });

    const populated = await Post.findById(post._id)
      .populate('author', 'name avatar companyName role');

    const obj = populated.toObject();
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: { ...obj, isLiked: false, likesCount: 0, commentsCount: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Get all posts (feed)
// ─── @route  GET /api/posts?page=1&limit=10
// ─── @access Private
exports.getAllPosts = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find()
      .populate('author',        'name avatar companyName role')
      .populate('comments.user', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total         = await Post.countDocuments();
    const currentUserId = req.user._id.toString();

    const formatted = posts.map((post) => {
      const obj = post.toObject();
      return {
        ...obj,
        isLiked:       obj.likes?.some((id) => id.toString() === currentUserId) || false,
        likesCount:    obj.likes?.length    || 0,
        commentsCount: obj.comments?.length || 0,
      };
    });

    res.status(200).json({
      success: true, posts: formatted,
      totalPages: Math.ceil(total / limit), currentPage: page, total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Get single post
// ─── @route  GET /api/posts/:id
// ─── @access Private
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author',        'name avatar companyName role')
      .populate('comments.user', 'name avatar role');

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const obj           = post.toObject();
    const currentUserId = req.user._id.toString();
    res.status(200).json({
      success: true,
      post: {
        ...obj,
        isLiked:       obj.likes?.some((id) => id.toString() === currentUserId) || false,
        likesCount:    obj.likes?.length    || 0,
        commentsCount: obj.comments?.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Update post
// ─── @route  PUT /api/posts/:id
// ─── @access Private
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const updated = await Post.findByIdAndUpdate(
      req.params.id, { content: req.body.content }, { new: true, runValidators: true }
    ).populate('author', 'name avatar companyName role')
     .populate('comments.user', 'name avatar role');

    const obj           = updated.toObject();
    const currentUserId = req.user._id.toString();
    res.status(200).json({
      success: true, message: 'Post updated successfully',
      post: {
        ...obj,
        isLiked:       obj.likes?.some((id) => id.toString() === currentUserId) || false,
        likesCount:    obj.likes?.length    || 0,
        commentsCount: obj.comments?.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Delete post
// ─── @route  DELETE /api/posts/:id
// ─── @access Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await Post.findByIdAndDelete(req.params.id);
    // No separate Comment/Like collections — everything embedded in Post
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Like / Unlike a post
// ─── @route  POST /api/posts/:id/like
// ─── @access Private
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId       = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }
    await post.save();

    res.status(200).json({
      success: true, message: alreadyLiked ? 'Post unliked' : 'Post liked',
      isLiked: !alreadyLiked, likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Add comment to post
// ─── @route  POST /api/posts/:id/comments
// ─── @access Private
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim())
      return res.status(400).json({ success: false, message: 'Comment content is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Embedded subdocument — field is 'user' not 'userId'
    post.comments.push({ user: req.user._id, content: content.trim() });
    await post.save();

    const updated      = await Post.findById(post._id).populate('comments.user', 'name avatar role');
    const addedComment = updated.comments[updated.comments.length - 1];

    res.status(201).json({ success: true, message: 'Comment added successfully', comment: addedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Get comments for a post
// ─── @route  GET /api/posts/:id/comments
// ─── @access Private
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', 'name avatar role');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.status(200).json({
      success: true, count: post.comments.length,
      comments: [...post.comments].reverse(),   // newest first
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Delete comment
// ─── @route  DELETE /api/posts/comments/:id
// ─── @access Private
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findOne({ 'comments._id': req.params.id });
    if (!post) return res.status(404).json({ success: false, message: 'Comment not found' });

    const comment = post.comments.id(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    // Ownership check uses 'user' not 'userId'
    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    post.comments.pull({ _id: req.params.id });
    await post.save();

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc   Get user's posts
// ─── @route  GET /api/posts/user/:userId
// ─── @access Private
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author',        'name avatar companyName role')
      .populate('comments.user', 'name avatar role')
      .sort({ createdAt: -1 });

    const currentUserId = req.user._id.toString();
    const formatted = posts.map((post) => {
      const obj = post.toObject();
      return {
        ...obj,
        isLiked:       obj.likes?.some((id) => id.toString() === currentUserId) || false,
        likesCount:    obj.likes?.length    || 0,
        commentsCount: obj.comments?.length || 0,
      };
    });

    res.status(200).json({ success: true, count: posts.length, posts: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};