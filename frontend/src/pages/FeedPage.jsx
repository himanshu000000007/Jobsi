import React from 'react';
import CreatePost from '../components/Feed/CreatePost';
import FeedList from '../components/Feed/FeedList';

const FeedPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feed</h1>
        <p className="text-gray-600">
          Connect with professionals, share insights, and discover opportunities
        </p>
      </div>
      
      <CreatePost />
      <FeedList />
    </div>
  );
};

export default FeedPage;