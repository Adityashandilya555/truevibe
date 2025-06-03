
import React, { useState, useRef } from 'react';
import { Camera, Mic, Music, Globe, Lock, X, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionDetectionEngine from '../../services/emotion/emotionDetectionEngine';

const PRIVACY_OPTIONS = [
  { value: 'public', icon: Globe, label: 'Public', description: 'Everyone can see' },
  { value: 'friends', icon: Lock, label: 'Friends Only', description: 'Only friends can see' }
];

export default function DailyVibesCreator({ onVibeCreated, onCancel }) {
  const [step, setStep] = useState('capture'); // capture, preview, post
  const [captureMode, setCaptureMode] = useState('photo'); // photo, text, audio
  const [content, setContent] = useState('');
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [privacy, setPrivacy] = useState('public');
  const [emotion, setEmotion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const emotionEngine = new EmotionDetectionEngine();

  // Initialize camera
  React.useEffect(() => {
    if (captureMode === 'photo') {
      initializeCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [captureMode]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedMedia(dataUrl);
      setStep('preview');
    }
  };

  const handleTextChange = (text) => {
    setContent(text);
    if (text.trim()) {
      const emotionAnalysis = emotionEngine.analyzeEmotion(text);
      setEmotion(emotionAnalysis);
    }
  };

  const handlePost = () => {
    const vibeData = {
      id: `vibe_${Date.now()}`,
      content: content || '',
      media_url: capturedMedia,
      media_type: captureMode,
      privacy,
      emotion: emotion?.primary || 'neutral',
      emotion_confidence: emotion?.confidence || 0.5,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Save to localStorage for demo
    const existingVibes = JSON.parse(localStorage.getItem('truevibe_daily_vibes') || '[]');
    existingVibes.unshift(vibeData);
    localStorage.setItem('truevibe_daily_vibes', JSON.stringify(existingVibes.slice(0, 10)));

    onVibeCreated(vibeData);
  };

  const retake = () => {
    setCapturedMedia(null);
    setContent('');
    setEmotion(null);
    setStep('capture');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
        <h2 className="font-semibold text-white">Daily Vibe</h2>
        {step === 'preview' && (
          <button
            onClick={handlePost}
            disabled={!capturedMedia && !content.trim()}
            className="bg-cyan-400 text-gray-900 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share
          </button>
        )}
        {step === 'capture' && (
          <div className="w-16"></div> // Spacer
        )}
      </div>

      {/* Capture Mode Selector */}
      {step === 'capture' && (
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setCaptureMode('photo')}
            className={`flex-1 py-3 text-center transition-colors ${
              captureMode === 'photo' ? 'bg-gray-700 text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Camera size={20} className="mx-auto mb-1" />
            <span className="text-xs">Photo</span>
          </button>
          <button
            onClick={() => setCaptureMode('text')}
            className={`flex-1 py-3 text-center transition-colors ${
              captureMode === 'text' ? 'bg-gray-700 text-cyan-400' : 'text-gray-400'
            }`}
          >
            <span className="text-lg mb-1 block">💭</span>
            <span className="text-xs">Text</span>
          </button>
          <button
            onClick={() => setCaptureMode('audio')}
            className={`flex-1 py-3 text-center transition-colors ${
              captureMode === 'audio' ? 'bg-gray-700 text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Mic size={20} className="mx-auto mb-1" />
            <span className="text-xs">Audio</span>
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="relative">
        {step === 'capture' && (
          <>
            {/* Photo Capture */}
            {captureMode === 'photo' && (
              <div className="relative aspect-square bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={capturePhoto}
                    className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Text Capture */}
            {captureMode === 'text' && (
              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="What's your vibe right now? ✨"
                  className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:border-cyan-400 focus:outline-none"
                  maxLength={280}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-400">
                    {content.length}/280
                  </span>
                  {emotion && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Detected:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getEmotionStyles(emotion.primary)}`}>
                        {emotion.primary}
                      </span>
                    </div>
                  )}
                </div>
                {content.trim() && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('preview')}
                    className="w-full mt-4 bg-cyan-400 text-gray-900 py-3 rounded-lg font-semibold"
                  >
                    Continue
                  </motion.button>
                )}
              </div>
            )}

            {/* Audio Capture */}
            {captureMode === 'audio' && (
              <div className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic size={32} className={isRecording ? 'text-red-400' : 'text-gray-400'} />
                </div>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-cyan-400 text-gray-900 hover:bg-cyan-300'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                <p className="text-gray-400 text-sm mt-4">
                  Record your authentic voice and feelings
                </p>
              </div>
            )}
          </>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="p-6">
            {capturedMedia && (
              <div className="mb-4">
                <img
                  src={capturedMedia}
                  alt="Captured vibe"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            
            {content && (
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-white">{content}</p>
                {emotion && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getEmotionStyles(emotion.primary)}`}>
                      {emotion.primary}
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.round(emotion.confidence * 100)}% confidence
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Privacy Settings */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Privacy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRIVACY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPrivacy(option.value)}
                    className={`p-3 rounded-lg border transition-colors ${
                      privacy === option.value
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <option.icon size={20} className="mx-auto mb-1" />
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs opacity-70">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={retake}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw size={16} />
                Retake
              </button>
              <button
                onClick={handlePost}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-400 text-gray-900 rounded-lg hover:bg-cyan-300 transition-colors font-semibold"
              >
                <Check size={16} />
                Share Vibe
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getEmotionStyles(emotion) {
  const styles = {
    joy: 'bg-yellow-400/20 text-yellow-400',
    trust: 'bg-cyan-400/20 text-cyan-400',
    fear: 'bg-purple-400/20 text-purple-400',
    surprise: 'bg-pink-400/20 text-pink-400',
    sadness: 'bg-blue-400/20 text-blue-400',
    disgust: 'bg-green-400/20 text-green-400',
    anger: 'bg-red-400/20 text-red-400',
    anticipation: 'bg-orange-400/20 text-orange-400'
  };
  return styles[emotion] || styles.joy;
}
