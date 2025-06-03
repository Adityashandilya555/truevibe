
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  Palette, 
  Sparkles, 
  Play, 
  Pause, 
  X,
  Check,
  RotateCcw
} from 'lucide-react';

const DailyVibesCreator = ({ onSubmit, onClose }) => {
  const [mode, setMode] = useState('mood'); // mood, photo, voice, color
  const [moodData, setMoodData] = useState({
    emotion: '',
    intensity: 50,
    description: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#4F46E5');

  const emotions = [
    { key: 'joyful', label: 'Joyful', color: 'bg-yellow-400', emoji: '😊' },
    { key: 'peaceful', label: 'Peaceful', color: 'bg-green-400', emoji: '😌' },
    { key: 'energetic', label: 'Energetic', color: 'bg-orange-400', emoji: '⚡' },
    { key: 'contemplative', label: 'Contemplative', color: 'bg-purple-400', emoji: '🤔' },
    { key: 'grateful', label: 'Grateful', color: 'bg-pink-400', emoji: '🙏' },
    { key: 'adventurous', label: 'Adventurous', color: 'bg-blue-400', emoji: '🌟' },
    { key: 'creative', label: 'Creative', color: 'bg-indigo-400', emoji: '🎨' },
    { key: 'determined', label: 'Determined', color: 'bg-red-400', emoji: '💪' }
  ];

  const colorPalettes = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handleMoodSelect = (emotion) => {
    setMoodData(prev => ({ ...prev, emotion }));
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedPhoto({ file, url });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate recorded audio
      setRecordedAudio({ duration: 30, url: 'demo-audio' });
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleSubmit = () => {
    const vibeData = {
      mode,
      timestamp: new Date().toISOString(),
      data: mode === 'mood' ? moodData : 
            mode === 'photo' ? selectedPhoto :
            mode === 'voice' ? recordedAudio :
            mode === 'color' ? { color: selectedColor } : null
    };

    if (onSubmit) {
      onSubmit(vibeData);
    }
    
    console.log('Daily vibe submitted:', vibeData);
  };

  const isComplete = () => {
    switch (mode) {
      case 'mood':
        return moodData.emotion && moodData.description;
      case 'photo':
        return selectedPhoto;
      case 'voice':
        return recordedAudio;
      case 'color':
        return selectedColor;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Daily Vibe</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { key: 'mood', icon: Sparkles, label: 'Mood' },
            { key: 'photo', icon: Camera, label: 'Photo' },
            { key: 'voice', icon: Mic, label: 'Voice' },
            { key: 'color', icon: Palette, label: 'Color' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`p-3 rounded-lg flex flex-col items-center space-y-1 transition-colors ${
                mode === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>

        {/* Content based on selected mode */}
        <AnimatePresence mode="wait">
          {mode === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Emotion Selection */}
              <div>
                <h3 className="text-white font-semibold mb-3">How are you feeling?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {emotions.map(emotion => (
                    <button
                      key={emotion.key}
                      onClick={() => handleMoodSelect(emotion.key)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        moodData.emotion === emotion.key
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{emotion.emoji}</span>
                        <span className="text-white text-sm">{emotion.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              {moodData.emotion && (
                <div>
                  <h3 className="text-white font-semibold mb-3">
                    Intensity: {moodData.intensity}%
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={moodData.intensity}
                    onChange={(e) => setMoodData(prev => ({ ...prev, intensity: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-white font-semibold mb-3">Tell us more...</h3>
                <textarea
                  value={moodData.description}
                  onChange={(e) => setMoodData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's making you feel this way?"
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {mode === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-white font-semibold">Capture your vibe</h3>
              
              {selectedPhoto ? (
                <div className="space-y-4">
                  <img
                    src={selectedPhoto.url}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} className="inline mr-2" />
                    Choose Different Photo
                  </button>
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400">Click to select a photo</p>
                  </div>
                </label>
              )}
            </motion.div>
          )}

          {mode === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-white font-semibold text-center">Record your vibe</h3>
              
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={toggleRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isRecording ? <Pause size={32} /> : <Mic size={32} />}
                </button>
                
                <p className="text-gray-400 text-center">
                  {isRecording 
                    ? 'Recording... tap to stop'
                    : recordedAudio 
                      ? 'Recording complete'
                      : 'Tap to start recording'
                  }
                </p>

                {recordedAudio && (
                  <div className="w-full bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Voice note recorded</span>
                      <span className="text-gray-400">{recordedAudio.duration}s</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {mode === 'color' && (
            <motion.div
              key="color"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-white font-semibold text-center">Pick your vibe color</h3>
              
              <div className="space-y-4">
                <div 
                  className="w-full h-24 rounded-lg border-4 border-white"
                  style={{ backgroundColor: selectedColor }}
                />
                
                <div className="grid grid-cols-5 gap-3">
                  {colorPalettes.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-lg border-2 transition-transform ${
                        selectedColor === color
                          ? 'border-white scale-110'
                          : 'border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isComplete()}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check size={20} />
          <span>Share Your Vibe</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DailyVibesCreator;
