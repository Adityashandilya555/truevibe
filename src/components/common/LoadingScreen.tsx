import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Emotion-based color transitions using Plutchik's wheel
const EMOTION_COLORS = {
  joy: 'from-yellow-300 to-yellow-400',
  trust: 'from-green-300 to-green-500',
  fear: 'from-emerald-600 to-emerald-700',
  surprise: 'from-sky-300 to-sky-400',
  sadness: 'from-blue-400 to-blue-600',
  disgust: 'from-purple-400 to-purple-600',
  anger: 'from-red-400 to-red-600',
  anticipation: 'from-orange-300 to-orange-500',
  default: 'from-indigo-500 to-purple-600'
} as const;

type EmotionType = keyof typeof EMOTION_COLORS;

interface LoadingScreenProps {
  /** Custom loading message to display */
  message?: string;
  /** Emotion theme for color transitions */
  emotion?: EmotionType;
  /** Whether to display as fullscreen overlay */
  fullScreen?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingScreen component for TrueVibe app
 * Displays an animated loading spinner with emotion-themed colors
 * 
 * @param props - Component props
 * @returns LoadingScreen component
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...", 
  emotion = "default", 
  fullScreen = true,
  className = ""
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>(emotion);
  
  // Cycle through emotions for loading animation
  useEffect(() => {
    if (emotion !== "default") return;
    
    const emotions = Object.keys(EMOTION_COLORS).filter(e => e !== 'default') as EmotionType[];
    let index = 0;
    
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[index]);
      index = (index + 1) % emotions.length;
    }, 2000); // Change color every 2 seconds
    
    return () => clearInterval(interval);
  }, [emotion]);
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex items-center justify-center z-50 bg-white dark:bg-gray-900" 
    : "flex items-center justify-center";
  
  return (
    <div 
      className={`${containerClasses} ${className}`}
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center p-6 max-w-sm">
        {/* TrueVibe Logo/Text */}
        <div className="mb-6 text-2xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            TrueVibe
          </span>
        </div>
        
        {/* Animated Spinner */}
        <div className="relative w-24 h-24 mb-4">
          {/* Outer ring */}
          <motion.div 
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${EMOTION_COLORS[currentEmotion]} opacity-70`}
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 2, ease: "linear", repeat: Infinity },
              scale: { duration: 1, repeat: Infinity }
            }}
          />
          
          {/* Inner ring */}
          <motion.div 
            className="absolute inset-2 rounded-full bg-white dark:bg-gray-800"
            animate={{ 
              rotate: -180,
              scale: [1, 0.95, 1]
            }}
            transition={{ 
              rotate: { duration: 3, ease: "linear", repeat: Infinity },
              scale: { duration: 1, repeat: Infinity, delay: 0.5 }
            }}
          />
          
          {/* Center dot */}
          <motion.div 
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${EMOTION_COLORS[currentEmotion]}`}
            animate={{ 
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity
            }}
          />
        </div>
        
        {/* Loading Message */}
        <div 
          className="text-gray-700 dark:text-gray-300 text-center animate-pulse"
          aria-label={message}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
