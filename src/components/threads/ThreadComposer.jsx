import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image, 
  Video, 
  Mic, 
  X, 
  Hash,
  Sparkles,
  Brain,
  Heart
} from 'lucide-react';

const ThreadComposer = ({ onSubmit, placeholder = "What's on your mind?" }) => {
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [emotionScore, setEmotionScore] = useState(0);
  const [hashtags, setHashtags] = useState([]);
  const [media, setMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Simple emotion detection for demo
  const detectEmotion = (text) => {
    const emotions = {
      joy: ['happy', 'excited', 'amazing', 'awesome', 'love', 'wonderful', 'great', 'fantastic', '😄', '😊', '🎉', '❤️', '🚀'],
      sadness: ['sad', 'down', 'depressed', 'unhappy', 'crying', 'hurt', 'pain', '😢', '😞', '💔'],
      anger: ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', '😠', '😡', '🤬'],
      fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'terrified', '😰', '😨'],
      surprise: ['surprised', 'shocked', 'amazed', 'wow', 'incredible', 'unbelievable', '😲', '😱'],
      trust: ['trust', 'reliable', 'confident', 'secure', 'safe', 'believe'],
      anticipation: ['excited', 'looking forward', 'can\'t wait', 'anticipating', 'eager'],
      disgust: ['disgusted', 'gross', 'yuck', 'revolting', 'sick', '🤢', '🤮']
    };

    const lowerText = text.toLowerCase();
    let maxScore = 0;
    let detectedEmotion = 'neutral';

    for (const [emotionKey, keywords] of Object.entries(emotions)) {
      let score = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += 1;
        }
      });

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotionKey;
      }
    }

    return {
      emotion: detectedEmotion,
      score: Math.min(maxScore * 0.3 + 0.1, 1)
    };
  };

  // Real-time emotion analysis
  useEffect(() => {
    if (content.trim()) {
      const analysis = detectEmotion(content);
      setEmotion(analysis.emotion);
      setEmotionScore(analysis.score);

      // Extract hashtags
      const hashtagMatches = content.match(/#[\w]+/g) || [];
      setHashtags(hashtagMatches.map(tag => tag.slice(1)));
    } else {
      setEmotion(null);
      setEmotionScore(0);
      setHashtags([]);
    }
  }, [content]);

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'text-yellow-400',
      trust: 'text-green-400',
      fear: 'text-purple-400',
      surprise: 'text-pink-400',
      sadness: 'text-blue-400',
      disgust: 'text-gray-400',
      anger: 'text-red-400',
      anticipation: 'text-orange-400',
      neutral: 'text-gray-400'
    };
    return colors[emotion] || 'text-gray-400';
  };

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const threadData = {
        content: content.trim(),
        emotion: emotion || 'neutral',
        emotion_score: emotionScore,
        hashtags,
        media_url: media?.url,
        media_type: media?.type
      };

      if (onSubmit) {
        await onSubmit(threadData);
      } else {
        // Demo functionality
        console.log('Thread posted:', threadData);
      }

      // Reset form
      setContent('');
      setMedia(null);
      setEmotion(null);
      setEmotionScore(0);
      setHashtags([]);
    } catch (error) {
      console.error('Error submitting thread:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMedia({
        file,
        url,
        type: file.type
      });
    }
  };

  const removeMedia = () => {
    if (media?.url) {
      URL.revokeObjectURL(media.url);
    }
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  const suggestionKeywords = ['coding', 'creativity', 'mindfulness', 'learning', 'travel', 'music', 'art', 'technology', 'nature', 'wellness'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6"
    >
      {/* Emotion Analysis Display */}
      <AnimatePresence>
        {emotion && emotion !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className={`w-5 h-5 ${getEmotionColor(emotion)}`} />
                <span className="text-white font-medium">
                  Detected emotion: <span className={getEmotionColor(emotion)}>{emotion}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Sparkles size={14} />
                <span>{Math.round(emotionScore * 100)}% confident</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Input */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-lg leading-relaxed"
          style={{ minHeight: '80px' }}
          maxLength={280}
        />

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            {hashtags.map((hashtag, index) => (
              <span key={index} className="text-blue-400 text-sm">
                #{hashtag}
              </span>
            ))}
          </div>
          <span className={`text-sm ${content.length > 250 ? 'text-red-400' : 'text-gray-400'}`}>
            {content.length}/280
          </span>
        </div>
      </div>

      {/* Media Preview */}
      <AnimatePresence>
        {media && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 relative"
          >
            <div className="relative rounded-lg overflow-hidden max-h-60">
              {media.type.startsWith('image/') ? (
                <img
                  src={media.url}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              ) : media.type.startsWith('video/') ? (
                <video
                  src={media.url}
                  controls
                  className="w-full h-full"
                />
              ) : null}

              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-gray-900/80 text-white rounded-full p-1 hover:bg-gray-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Media Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-blue-400 transition-colors"
            title="Add media"
          >
            <Image size={20} />
          </button>

          {/* Hashtag Suggestions */}
          <button
            onClick={() => setShowHashtagSuggestions(!showHashtagSuggestions)}
            className="text-gray-400 hover:text-green-400 transition-colors"
            title="Add hashtag"
          >
            <Hash size={20} />
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
          <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
        </button>
      </div>

      {/* Hashtag Suggestions */}
      <AnimatePresence>
        {showHashtagSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-600"
          >
            <p className="text-sm text-gray-400 mb-2">Suggested hashtags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setContent(prev => prev + (prev.endsWith(' ') ? '' : ' ') + `#${keyword} `)}
                  className="px-3 py-1 bg-gray-700 text-blue-400 rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  #{keyword}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThreadComposer;