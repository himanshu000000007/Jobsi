import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, deleteComment } from '../../redux/slices/feedSlice';
import Button from '../Common/Button';
import { FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ postId, comments = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.feed);
  
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    try {
      await dispatch(addComment({ postId, content: commentText })).unwrap();
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment({ postId, commentId })).unwrap();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        <img
          src={user?.avatar || 'https://via.placeholder.com/32'}
          alt={user?.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !commentText.trim()}
          size="sm"
        >
          Post
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start space-x-3">
            <img
              src={comment.user?.avatar || 'https://via.placeholder.com/32'}
              alt={comment.user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {comment.user?.name}
                  </h4>
                  {user?._id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-4">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;