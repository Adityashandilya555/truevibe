
import React, { useState } from 'react';
import { useEmotion } from '../hooks';

const VibesPage = () => {
  const [vibeText, setVibeText] = useState('');
  const [mode, setMode] = useState('text');
  const [privacy, setPrivacy] = useState('public');
  const { analyzeEmotion } = useEmotion();

  const handleVibeChange = (e) => {
    setVibeText(e.target.value);
  };

  const handleShare = () => {
    if (vibeText.trim()) {
      const emotion = analyzeEmotion(vibeText);
      console.log('Sharing vibe:', { text: vibeText, emotion, privacy });
      // TODO: Save to database
      setVibeText('');
    }
  };

  const mockVibes = [
    {
      id: 1,
      user: 'You',
      content: 'Feeling grateful for small moments today ✨',
      timestamp: '2h ago',
      emotion: 'joy'
    },
    {
      id: 2,
      user: 'Sarah Chen',
      content: 'Working late but excited about tomorrow\'s presentation!',
      timestamp: '4h ago',
      emotion: 'anticipation'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      content: 'Coffee and coding, my favorite combination ☕',
      timestamp: '6h ago',
      emotion: 'joy'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Daily Vibe</h1>
          <p className="text-gray-400">Share your moment - text, image, or audio</p>
        </div>

        {/* Vibe Composer */}
        <div className="card p-6 mb-8">
          {/* Mode Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('text')}
              className={`px-4 py-2 rounded-lg font-medium ${
                mode === 'text' 
                  ? 'bg-cyan-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📝 Text
            </button>
            <button
              onClick={() => setMode('photo')}
              className={`px-4 py-2 rounded-lg font-medium ${
                mode === 'photo' 
                  ? 'bg-cyan-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📷 Photo
            </button>
            <button
              onClick={() => setMode('audio')}
              className={`px-4 py-2 rounded-lg font-medium ${
                mode === 'audio' 
                  ? 'bg-cyan-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎵 Audio
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={vibeText}
            onChange={handleVibeChange}
            placeholder="What's your vibe today?"
            className="w-full h-32 p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-500"
          />

          {/* Privacy Toggle */}
          <div className="flex gap-4 mt-4 mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="public"
                checked={privacy === 'public'}
                onChange={(e) => setPrivacy(e.target.value)}
                className="mr-2 text-cyan-500"
              />
              <span className="text-gray-300">Public</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="private"
                checked={privacy === 'private'}
                onChange={(e) => setPrivacy(e.target.value)}
                className="mr-2 text-cyan-500"
              />
              <span className="text-gray-300">Private (Friends Only)</span>
            </label>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={!vibeText.trim()}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share Vibe
          </button>
        </div>

        {/* Today's Vibes */}
        <div>
          <h2 className="text-xl font-bold mb-4">Today's Vibes</h2>
          <div className="grid gap-4">
            {mockVibes.map((vibe) => (
              <div key={vibe.id} className={`card p-4 emotion-${vibe.emotion}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{vibe.user}</span>
                  <span className="text-sm text-gray-400">{vibe.timestamp}</span>
                </div>
                <p className="text-gray-300">{vibe.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibesPage;
