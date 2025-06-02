import { useState, useCallback } from 'react';
import { analyzeEmotion, getEmotionBorder, getEmotionColor, getEmotionTrend } from '../services/emotion/vaderEnhanced';

/**
 * Custom hook for emotion analysis functionality
 * Wraps the vaderEnhanced service and provides emotion detection capabilities
 * 
 * @returns {Object} Emotion analysis state and methods
 */
const useEmotion = () => {
  // State for emotion analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  
  /**
   * Analyze text for emotional content
   * @param {string} text - Text to analyze
   * @returns {Object} Emotion analysis result
   */
  const analyzeText = useCallback(async (text) => {
    if (!text || text.trim() === '') {
      return {
        dominantEmotion: 'neutral',
        confidence: 0,
        color: getEmotionColor('neutral'),
        border: getEmotionBorder('neutral')
      };
    }
    
    setAnalyzing(true);
    setError(null);
    
    try {
      // The vaderEnhanced service is synchronous despite using async/await pattern here
      const result = analyzeEmotion(text);
      
      // Enhance result with border style
      const enhancedResult = {
        ...result,
        border: getEmotionBorder(result.dominantEmotion)
      };
      
      setLastAnalysis(enhancedResult);
      return enhancedResult;
    } catch (err) {
      console.error('Error analyzing emotion:', err);
      setError('Failed to analyze emotion. Please try again.');
      return {
        dominantEmotion: 'neutral',
        confidence: 0,
        color: getEmotionColor('neutral'),
        border: getEmotionBorder('neutral')
      };
    } finally {
      setAnalyzing(false);
    }
  }, []);
  
  /**
   * Debounced version of analyzeText for real-time typing
   * @param {string} text - Text to analyze
   * @param {number} delay - Debounce delay in ms
   * @returns {Promise<Function>} Debounced analysis function
   */
  const debouncedAnalyzeText = useCallback((text, delay = 300) => {
    return new Promise((resolve) => {
      if (window.emotionDebounceTimer) {
        clearTimeout(window.emotionDebounceTimer);
      }
      
      window.emotionDebounceTimer = setTimeout(async () => {
        const result = await analyzeText(text);
        resolve(result);
      }, delay);
    });
  }, [analyzeText]);
  
  /**
   * Get emotion trends from local storage
   * @returns {Object} Emotion trends with percentages
   */
  const getEmotionTrends = useCallback(() => {
    try {
      return getEmotionTrend();
    } catch (err) {
      console.error('Error getting emotion trends:', err);
      setError('Failed to retrieve emotion trends');
      return {};
    }
  }, []);
  
  /**
   * Get color for an emotion
   * @param {string} emotion - Emotion name
   * @returns {string} Hex color code
   */
  const getColorForEmotion = useCallback((emotion) => {
    return getEmotionColor(emotion || 'neutral');
  }, []);
  
  /**
   * Get border style for an emotion
   * @param {string} emotion - Emotion name
   * @returns {string} CSS border style
   */
  const getBorderForEmotion = useCallback((emotion) => {
    return getEmotionBorder(emotion || 'neutral');
  }, []);
  
  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    // State
    analyzing,
    error,
    lastAnalysis,
    
    // Methods
    analyzeText,
    debouncedAnalyzeText,
    getEmotionTrends,
    getColorForEmotion,
    getBorderForEmotion,
    clearError
  };
};

export default useEmotion;

/**
 * TypeScript types (for documentation)
 * 
 * @typedef {Object} EmotionAnalysis
 * @property {string} dominantEmotion - Primary detected emotion
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} color - Hex color code for the emotion
 * @property {string} border - CSS border style for the emotion
 * @property {Object} scores - Raw sentiment scores
 * @property {Object} emotionScores - Scores for each emotion
 */
import { useState, useCallback } from 'react';

const useEmotion = () => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);

  const analyzeEmotion = useCallback((text) => {
    // Simple emotion analysis - this would be replaced with actual VADER analysis
    const emotions = {
      joy: ['happy', 'excited', 'amazing', 'wonderful', 'great', 'love'],
      sadness: ['sad', 'disappointed', 'down', 'upset', 'hurt'],
      anger: ['angry', 'mad', 'furious', 'hate', 'annoyed'],
      fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous'],
      surprise: ['wow', 'amazing', 'incredible', 'unexpected'],
      trust: ['trust', 'believe', 'confident', 'reliable'],
      anticipation: ['excited', 'looking forward', 'can\'t wait', 'hopeful'],
      disgust: ['disgusting', 'awful', 'terrible', 'gross']
    };

    const words = text.toLowerCase().split(' ');
    let detectedEmotion = 'neutral';
    let maxMatches = 0;

    for (const [emotion, keywords] of Object.entries(emotions)) {
      const matches = keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    }

    const calculatedConfidence = Math.min(0.9, 0.3 + (maxMatches * 0.2));
    
    setCurrentEmotion(detectedEmotion);
    setConfidence(calculatedConfidence);

    return { emotion: detectedEmotion, confidence: calculatedConfidence };
  }, []);

  return {
    currentEmotion,
    confidence,
    analyzeEmotion
  };
};

export default useEmotion;
