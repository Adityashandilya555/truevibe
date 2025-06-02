import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Camera, Edit3, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('threads');

  const mockProfile = {
    name: "Demo User",
    username: "@demouser",
    bio: "Creative soul exploring the depths of human emotion through technology. Building connections one authentic conversation at a time.",
    adjectives: ["Creative", "Empathetic", "Curious"],
    location: "Digital Nomad",
    joinDate: "January 2024",
    website: "truevibe.com",
    stats: {
      threads: 42,
      followers: 128,
      following: 89,
      vibes: 256
    },
    stories: [
      { id: 1, emotion: 'joy', preview: '🎉' },
      { id: 2, emotion: 'trust', preview: '🤝' },
      { id: 3, emotion: 'anticipation', preview: '⚡' }
    ]
  };

  const emotionColors = {
    joy: '#FFD700',
    trust: '#4169E1',
    anticipation: '#FFA500'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="relative -mt-16 mb-4">
            {/* Profile Picture */}
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full border-4 border-gray-900 flex items-center justify-center text-2xl font-bold">
              {mockProfile.name.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 p-2 rounded-full transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Name and Bio */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold">{mockProfile.name}</h1>
                <p className="text-gray-400">{mockProfile.username}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-300 mb-3">{mockProfile.bio}</p>

            {/* Adjectives */}
            <div className="flex gap-2 mb-3">
              {mockProfile.adjectives.map((adj, index) => (
                <span 
                  key={index}
                  className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm"
                >
                  {adj}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {mockProfile.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {mockProfile.joinDate}
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <span className="text-cyan-400">{mockProfile.website}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around bg-gray-800 rounded-xl p-4 mb-4">
            {Object.entries(mockProfile.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-xl font-bold text-cyan-400">{value}</p>
                <p className="text-sm text-gray-400 capitalize">{key}</p>
              </div>
            ))}
          </div>

          {/* Stories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Stories</h3>
            <div className="flex gap-3">
              <button className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                +
              </button>
              {mockProfile.stories.map((story) => (
                <div 
                  key={story.id}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 cursor-pointer"
                  style={{ borderColor: emotionColors[story.emotion] }}
                >
                  {story.preview}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex">
              {['threads', 'media', 'likes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-cyan-400 text-cyan-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'threads' && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-300">Your threads will appear here once you start posting!</p>
                </div>
              </div>
            )}
            {activeTab === 'media' && (
              <div className="grid grid-cols-3 gap-1">
                {/* Placeholder for media grid */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-800 rounded"></div>
                ))}
              </div>
            )}
            {activeTab === 'likes' && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-300">Threads you've liked will appear here!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;