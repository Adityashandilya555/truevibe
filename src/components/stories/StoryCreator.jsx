
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image, X } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import { analyzeEmotion } from '../../services/vaderAnalysis';

const EMOTION_THEMES = {
  joy: { color: '#FFD700', label: 'Joyful', emoji: '😊' },
  trust: { color: '#4169E1', label: 'Trustful', emoji: '🤝' },
  anticipation: { color: '#FF69B4', label: 'Excited', emoji: '🎉' },
  surprise: { color: '#FFA500', label: 'Surprised', emoji: '😲' },
  sadness: { color: '#4682B4', label: 'Reflective', emoji: '💭' },
  fear: { color: '#800080', label: 'Vulnerable', emoji: '🤗' },
  anger: { color: '#DC143C', label: 'Passionate', emoji: '🔥' },
  disgust: { color: '#228B22', label: 'Critical', emoji: '🤔' }
};

const StoryCreator = ({ onClose, onStoryCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    
    if (text.trim()) {
      const emotionData = analyzeEmotion(text);
      if (emotionData && emotionData.emotion) {
        setSelectedTheme(emotionData.emotion.toLowerCase());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || (!content.trim() && !image)) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('stories')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('stories')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl,
          emotion_theme: selectedTheme,
          privacy: privacy,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      onStoryCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Story</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Share your moment..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <label className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                <Camera size={16} />
                <span className="text-sm">Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              <label className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                <Image size={16} />
                <span className="text-sm">Gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Emotion Theme */}
          {selectedTheme && EMOTION_THEMES[selectedTheme] && (
            <div className="p-3 rounded-lg border-2" style={{ borderColor: EMOTION_THEMES[selectedTheme].color }}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{EMOTION_THEMES[selectedTheme].emoji}</span>
                <span className="font-medium" style={{ color: EMOTION_THEMES[selectedTheme].color }}>
                  {EMOTION_THEMES[selectedTheme].label} Story
                </span>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Privacy
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="public"
                  checked={privacy === 'public'}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="friends"
                  checked={privacy === 'friends'}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Friends Only</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !image)}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Sharing...' : 'Share Story'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StoryCreator;
