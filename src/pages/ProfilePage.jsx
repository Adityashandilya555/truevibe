import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit, Calendar, MapPin, Link, Heart, MessageSquare } from 'lucide-react';

const ProfilePage = () => {
  const profile = {
    name: 'Demo User',
    username: '@demouser',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Exploring emotions through authentic connections 🌟',
    location: 'San Francisco, CA',
    website: 'truevibe.com',
    joined: 'January 2024',
    followers: 1247,
    following: 432,
    posts: 89,
    adjectives: ['Creative', 'Empathetic', 'Adventurous']
  };

  const recentPosts = [
    {
      id: 1,
      content: 'Just had the most amazing conversation about the nature of happiness...',
      emotion: 'joyful',
      likes: 34,
      comments: 12,
      timestamp: '2h ago'
    },
    {
      id: 2,
      content: 'Reflecting on how much I\'ve grown this past year. Grateful for every experience.',
      emotion: 'grateful',
      likes: 45,
      comments: 8,
      timestamp: '1d ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 rounded-full border-4 border-blue-400"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <p className="text-gray-400">{profile.username}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                <Edit size={20} />
              </button>
              <button className="p-2 bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          <p className="text-white mb-4">{profile.bio}</p>

          <div className="flex flex-wrap items-center space-x-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Link size={16} />
              <span className="text-blue-400">{profile.website}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>Joined {profile.joined}</span>
            </div>
          </div>

          {/* Adjectives */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.adjectives.map((adjective, index) => (
              <span
                key={index}
                className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {adjective}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.posts}</div>
              <div className="text-gray-400 text-sm">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.followers}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.following}</div>
              <div className="text-gray-400 text-sm">Following</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs capitalize">
                    {post.emotion}
                  </span>
                  <span className="text-gray-400 text-sm">{post.timestamp}</span>
                </div>
                <p className="text-white mb-3">{post.content}</p>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={16} />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;