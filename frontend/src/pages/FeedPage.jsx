// frontend/src/pages/FeedPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts, createPost, deletePost,
  toggleLike, addComment, fetchComments, resetFeed,
} from '../redux/slices/feedSlice';
import Navbar  from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import toast   from 'react-hot-toast';
import {
  FaHeart, FaRegHeart, FaComment, FaTrash,
  FaPaperPlane, FaImage, FaSpinner,
} from 'react-icons/fa';

// ─── Avatar helper (no external image service) ────────────────────────────────
const Avatar = ({ name = '?', size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg' };
  const colors = [
    'bg-blue-500','bg-purple-500','bg-green-500',
    'bg-pink-500','bg-indigo-500','bg-orange-500','bg-teal-500',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

// ─── Time ago helper ──────────────────────────────────────────────────────────
const timeAgo = (date) => {
  if (!date) return '';
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Single Post Card ─────────────────────────────────────────────────────────
const PostCard = ({ post, currentUser }) => {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [commentText,  setCommentText]  = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  const userId  = currentUser?._id;
  const isOwner = post.author?._id?.toString() === userId?.toString() || post.author?.toString() === userId?.toString();
  const isLiked = post.isLiked || post.likes?.some((id) => id?.toString() === userId?.toString());

  const handleLike = () => {
    dispatch(toggleLike(post._id));
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await dispatch(deletePost(post._id)).unwrap();
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleToggleComments = () => {
    if (!showComments && !post.comments) {
      dispatch(fetchComments(post._id));
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await dispatch(addComment({ postId: post._id, content: commentText.trim() })).unwrap();
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar name={post.author?.name || 'U'} size="md" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{post.author?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-400">
              {post.author?.role?.toLowerCase().replace('_', ' ')} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        {isOwner && (
          <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 transition p-1">
            <FaTrash size={13} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="mt-3 rounded-lg w-full object-cover max-h-80"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="px-4 pb-2 flex items-center gap-4 text-xs text-gray-400 border-b border-gray-100">
        <span>{post.likesCount || post.likes?.length || 0} likes</span>
        <span>{post.commentsCount || 0} comments</span>
      </div>

      {/* Actions */}
      <div className="flex px-2 py-1">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg text-sm font-medium transition ${
            isLiked ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />} Like
        </button>
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
        >
          <FaComment /> Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          {/* Existing comments */}
          <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
            {!post.comments ? (
              <p className="text-xs text-gray-400 text-center py-2">Loading comments...</p>
            ) : post.comments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
            ) : (
              post.comments.map((c, i) => (
                <div key={c._id || i} className="flex gap-2">
                  <Avatar name={c.user?.name || 'U'} size="sm" />
                  <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-gray-700">{c.user?.name || 'User'}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add comment */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <Avatar name={currentUser?.name || 'U'} size="sm" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition flex-shrink-0"
              >
                {submitting ? <FaSpinner className="animate-spin" size={12} /> : <FaPaperPlane size={12} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ─── Create Post Box ──────────────────────────────────────────────────────────
const CreatePostBox = ({ user }) => {
  const dispatch  = useDispatch();
  const { creating } = useSelector((state) => state.feed);
  const [text,     setText]     = useState('');
  const [image,    setImage]    = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImage(file);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      const formData = new FormData();
      if (text.trim()) formData.append('content', text.trim());
      if (image) formData.append('images', image);

      // FIX: Send FormData for image upload
      await dispatch(createPost(formData)).unwrap();
      
      setText('');
      setImage(null);
      setPreview(null);
      setExpanded(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Post shared!');
    } catch {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex gap-3">
        <Avatar name={user?.name || 'U'} size="md" />
        <div className="flex-1">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full text-left bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-500 transition"
            >
              What's on your mind, {user?.name?.split(' ')[0]}?
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              
              {/* Image preview */}
              {preview && (
                <div className="relative mt-2">
                  <img src={preview} alt="Preview" className="rounded-lg max-h-64 w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                {/* FIX: Functional photo button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-gray-400 hover:text-blue-500 text-sm transition"
                >
                  <FaImage size={14} /> Photo
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { 
                      setExpanded(false); 
                      setText(''); 
                      handleRemoveImage();
                    }}
                    className="px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || (!text.trim() && !image)}
                    className="px-5 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    {creating && <FaSpinner className="animate-spin" size={12} />}
                    Post
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Feed Page ───────────────────────────────────────────────────────────
const FeedPage = () => {
  const dispatch    = useDispatch();
  const { user }    = useSelector((state) => state.auth);
  const { posts, loading, error, hasMore, page } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchPosts(1));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchPosts(page + 1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />

        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Feed</h1>

            {/* Create Post */}
            <CreatePostBox user={user} />

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <button
                  onClick={() => dispatch(fetchPosts(1))}
                  className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && posts.length === 0 && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                    <div className="flex gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Posts */}
            {posts.length > 0 && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} currentUser={user} />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500 text-lg">No posts yet.</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share something!</p>
              </div>
            )}

            {/* Load More */}
            {posts.length > 0 && (
              <div className="text-center mt-6">
                {loading ? (
                  <FaSpinner className="animate-spin text-blue-600 mx-auto" size={20} />
                ) : hasMore ? (
                  <button
                    onClick={handleLoadMore}
                    className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-2.5 rounded-lg transition font-medium text-sm"
                  >
                    Load More
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm">You've seen all posts</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedPage;