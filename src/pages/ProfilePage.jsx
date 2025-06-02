import React from 'react';
import { Plus } from 'lucide-react';

const ProfilePage = () => {
  const userStories = [
    { id: 1, hasContent: true, timestamp: '3h ago' },
    { id: 2, hasContent: false }
  ];

  const friendsStories = [
    { id: 1, user: 'Sarah', avatar: '/api/placeholder/40/40', viewed: false },
    { id: 2, user: 'Mike', avatar: '/api/placeholder/40/40', viewed: true },
    { id: 3, user: 'Emma', avatar: '/api/placeholder/40/40', viewed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-4">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-600 border-4 border-cyan-400 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-gray-300">👤</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Jordan Smith</h1>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 bg-cyan-500 text-gray-900 rounded-full text-sm font-medium">
              Creative
            </span>
            <span className="px-3 py-1 bg-cyan-500 text-gray-900 rounded-full text-sm font-medium">
              Empathetic
            </span>
            <span className="px-3 py-1 bg-cyan-500 text-gray-900 rounded-full text-sm font-medium">
              Curious
            </span>
          </div>
        </div>

        {/* Your Stories Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Stories</h2>
            <button className="btn-primary text-sm px-3 py-1">
              + Add Story
            </button>
          </div>

          <div className="flex gap-4">
            {userStories.map((story) => (
              <div key={story.id} className="flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                    story.hasContent 
                      ? 'bg-orange-500 border-cyan-400' 
                      : 'border-dashed border-gray-500 bg-gray-800'
                  }`}
                >
                  {story.hasContent ? (
                    <span className="text-xl">🔥</span>
                  ) : (
                    <Plus size={20} className="text-gray-500" />
                  )}
                </div>
                {story.hasContent && (
                  <span className="text-xs text-gray-400 mt-1">{story.timestamp}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Friends Stories Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Friends Stories</h2>
          <div className="flex gap-4">
            {friendsStories.map((story) => (
              <div key={story.id} className="flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-full border-2 ${
                    story.viewed 
                      ? 'border-gray-500' 
                      : 'border-cyan-400'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {story.user.charAt(0)}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">{story.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;