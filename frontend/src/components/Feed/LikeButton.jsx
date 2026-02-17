import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../../redux/slices/feedSlice';
import { FiThumbsUp } from 'react-icons/fi';
import { FaThumbsUp } from 'react-icons/fa';

const LikeButton = ({ postId, likes = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const hasLiked = likes.some((like) => like._id === user?._id || like === user?._id);
  const likeCount = likes.length;

  const handleToggleLike = async () => {
    try {
      await dispatch(toggleLike(postId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
        hasLiked
          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
      }`}
    >
      {hasLiked ? <FaThumbsUp size={20} /> : <FiThumbsUp size={20} />}
      <span className="font-medium">
        {hasLiked ? 'Liked' : 'Like'}
        {likeCount > 0 && ` (${likeCount})`}
      </span>
    </button>
  );
};

export default LikeButton;