/**
 * TrueVibe Enhanced VADER Sentiment Analysis
 * Combines VADER sentiment analysis with Plutchik's wheel of emotions
 * for nuanced emotion detection with privacy-focused processing.
 */

import vader from 'vader-sentiment';
import CryptoJS from 'crypto-js/crypto-js.js'

// Color mapping for Plutchik's 8 primary emotions
const EMOTION_COLORS = {
  joy: '#FFD700',       // Gold
  trust: '#4169E1',     // Royal Blue
  fear: '#800080',      // Purple
  surprise: '#FFA500',  // Orange
  sadness: '#0000FF',   // Blue
  disgust: '#008000',   // Green
  anger: '#FF0000',     // Red
  anticipation: '#FFFF00', // Yellow
  neutral: '#A9A9A9'    // Dark Gray (fallback)
};

// CSS Border strings for each emotion
const EMOTION_BORDERS = {
  joy: '2px solid #FFD700',
  trust: '2px solid #4169E1',
  fear: '2px solid #800080',
  surprise: '2px solid #FFA500',
  sadness: '2px solid #0000FF',
  disgust: '2px solid #008000',
  anger: '2px solid #FF0000',
  anticipation: '2px solid #FFFF00',
  neutral: '2px solid #A9A9A9'
};

// Hashtag emotion modifiers
const HASHTAG_EMOTIONS = {
  '#happy': { emotion: 'joy', value: 0.3 },
  '#sad': { emotion: 'sadness', value: 0.3 },
  '#angry': { emotion: 'anger', value: 0.3 },
  '#fear': { emotion: 'fear', value: 0.3 },
  '#trust': { emotion: 'trust', value: 0.3 },
  '#disgust': { emotion: 'disgust', value: 0.3 },
  '#surprise': { emotion: 'surprise', value: 0.3 },
  '#anticipation': { emotion: 'anticipation', value: 0.3 },
  // Common social media hashtags
  '#love': { emotion: 'joy', value: 0.3 },
  '#excited': { emotion: 'anticipation', value: 0.25 },
  '#worried': { emotion: 'fear', value: 0.25 },
  '#upset': { emotion: 'sadness', value: 0.25 },
  '#mad': { emotion: 'anger', value: 0.25 },
  '#gross': { emotion: 'disgust', value: 0.25 },
  '#wow': { emotion: 'surprise', value: 0.25 },
  '#faith': { emotion: 'trust', value: 0.25 }
};

// Emoji lexicon enhancements for VADER
const EMOJI_LEXICON = {
  '😊': { emotion: 'joy', value: 2.0 },
  '😃': { emotion: 'joy', value: 2.0 },
  '😢': { emotion: 'sadness', value: -2.0 },
  '😡': { emotion: 'anger', value: -2.0 },
  '😨': { emotion: 'fear', value: -1.5 },
  '🤢': { emotion: 'disgust', value: -2.0 },
  '😲': { emotion: 'surprise', value: 1.0 },
  '🤔': { emotion: 'anticipation', value: 0.5 },
  '🙏': { emotion: 'trust', value: 1.5 }
  // Could be expanded with more emojis
};

// LRU Cache implementation
class LRUCache {
  constructor(capacity = 1000) {
    this.capacity = capacity;
    this.cache = new Map();
    this.expiry = new Map(); // Timestamp for revalidation
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Check if entry has expired (1 hour)
    const timestamp = this.expiry.get(key);
    if (Date.now() - timestamp > 3600000) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    
    // Refresh item by removing and re-adding
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    // Remove oldest item if at capacity
    if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.expiry.delete(oldestKey);
    }
    
    // Add new item
    this.cache.set(key, value);
    this.expiry.set(key, Date.now());
  }
}

// Initialize cache
const emotionCache = new LRUCache();

// Storage handling with encryption
const ENCRYPTION_KEY = 'TrueVibe-EmotionData-AES256-Key';

const emotionStorage = {
  getItem: (key) => {
    try {
      const encryptedData = localStorage.getItem(`truevibe_emotion_${key}`);
      if (!encryptedData) return null;
      
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      
      // Check for expiry (24 hours)
      if (Date.now() - decryptedData.timestamp > 86400000) {
        localStorage.removeItem(`truevibe_emotion_${key}`);
        return null;
      }
      
      return decryptedData.value;
    } catch (error) {
      console.error('Error retrieving from emotion storage:', error);
      return null;
    }
  },
  
  setItem: (key, value) => {
    try {
      const data = {
        value,
        timestamp: Date.now()
      };
      
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        ENCRYPTION_KEY
      ).toString();
      
      localStorage.setItem(`truevibe_emotion_${key}`, encryptedData);
    } catch (error) {
      console.error('Error saving to emotion storage:', error);
    }
  },
  
  removeExpired: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('truevibe_emotion_')) {
          const encryptedData = localStorage.getItem(key);
          const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
          const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          
          if (Date.now() - data.timestamp > 86400000) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error removing expired emotion data:', error);
    }
  }
};

// Run cleanup on initialization
setTimeout(() => emotionStorage.removeExpired(), 1000);

/**
 * Normalizes text for emotion analysis
 * - Converts to lowercase
 * - Removes URLs
 * - Expands contractions
 * - Processes hashtags and emojis
 */
const normalizeText = (text) => {
  if (!text) return '';
  
  // Convert to lowercase
  let normalized = text.toLowerCase();
  
  // Remove URLs
  normalized = normalized.replace(/https?:\/\/[^\s]+/g, '');
  
  // Expand common contractions
  const contractions = {
    "can't": "cannot",
    "won't": "will not",
    "n't": " not",
    "'re": " are",
    "'s": " is",
    "'d": " would",
    "'ll": " will",
    "'t": " not",
    "'ve": " have",
    "'m": " am"
  };
  
  Object.keys(contractions).forEach(contraction => {
    const pattern = new RegExp(contraction, 'g');
    normalized = normalized.replace(pattern, contractions[contraction]);
  });
  
  return normalized;
};

/**
 * Gets VADER sentiment scores for the given text
 * Enhances with emoji lexicon and hashtag modifiers
 */
const getSentiment = (text) => {
  if (!text || typeof text !== 'string') {
    return { compound: 0, pos: 0, neg: 0, neu: 1 };
  }
  
  const normalized = normalizeText(text);
  
  // Get base VADER sentiment
  const baseScores = vader.SentimentIntensityAnalyzer.polarity_scores(normalized);
  let scores = { ...baseScores };
  
  // Process emojis
  for (const emoji in EMOJI_LEXICON) {
    if (text.includes(emoji)) {
      const { value } = EMOJI_LEXICON[emoji];
      // Adjust compound score (clamped between -1 and 1)
      scores.compound = Math.min(1, Math.max(-1, scores.compound + value * 0.1));
      
      // Adjust positive/negative scores
      if (value > 0) {
        scores.pos = Math.min(1, scores.pos + value * 0.05);
        scores.neg = Math.max(0, scores.neg - value * 0.03);
      } else {
        scores.neg = Math.min(1, scores.neg - value * 0.05);
        scores.pos = Math.max(0, scores.pos + value * 0.03);
      }
      
      // Recalculate neutral
      scores.neu = 1 - scores.pos - scores.neg;
    }
  }
  
  // Process hashtags
  const hashtags = text.match(/#\w+/g) || [];
  hashtags.forEach(hashtag => {
    if (HASHTAG_EMOTIONS[hashtag]) {
      const { value } = HASHTAG_EMOTIONS[hashtag];
      scores.compound = Math.min(1, Math.max(-1, scores.compound + value * 0.2));
      
      if (value > 0) {
        scores.pos = Math.min(1, scores.pos + value * 0.1);
      } else {
        scores.neg = Math.min(1, scores.neg - value * 0.1);
      }
      
      scores.neu = 1 - scores.pos - scores.neg;
    }
  });
  
  return scores;
};

/**
 * Maps sentiment scores to Plutchik emotions
 * Returns the dominant emotion and confidence level
 */
const mapToEmotion = (scores) => {
  const { compound, pos, neg, neu } = scores;
  
  // Emotional mappings based on VADER scores and Plutchik's wheel
  const emotions = {
    joy: compound >= 0.5 ? compound * 0.8 : 0,
    trust: compound >= 0.1 && compound <= 0.5 && pos > 0.3 ? pos * 0.7 : 0,
    fear: compound <= -0.3 && neg > 0.4 ? neg * 0.7 : 0,
    surprise: Math.abs(compound) < 0.1 && pos > 0.2 ? pos * 0.6 : 0,
    sadness: compound <= -0.1 && neg > 0.3 ? neg * 0.8 : 0,
    disgust: compound <= -0.4 && neg > 0.5 ? neg * 0.8 : 0,
    anger: compound <= -0.2 && neg > 0.4 ? neg * 0.9 : 0,
    anticipation: compound > 0.0 && pos > 0.2 ? pos * 0.7 : 0
  };
  
  // Find dominant emotion
  let dominantEmotion = 'neutral';
  let maxScore = 0;
  
  Object.entries(emotions).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  });
  
  // Calculate confidence (0-1)
  let confidence = maxScore;
  
  // Fallback to sentiment-based emotion for neutral
  if (dominantEmotion === 'neutral') {
    if (compound >= 0.3) {
      dominantEmotion = 'joy';
      confidence = compound * 0.7;
    } else if (compound <= -0.3) {
      dominantEmotion = 'sadness';
      confidence = Math.abs(compound) * 0.7;
    } else if (compound <= -0.5) {
      dominantEmotion = 'anger';
      confidence = Math.abs(compound) * 0.8;
    } else {
      confidence = 0.3; // Low confidence for neutral
    }
  }
  
  return {
    dominantEmotion,
    confidence: Math.min(confidence, 1),
    emotionScores: emotions
  };
};

/**
 * Main function to analyze emotion in text
 * Uses caching for performance and privacy-focused local processing
 */
export const analyzeEmotion = (text) => {
  if (!text) {
    return {
      dominantEmotion: 'neutral',
      confidence: 0,
      color: EMOTION_COLORS.neutral,
      scores: { compound: 0, pos: 0, neg: 0, neu: 1 }
    };
  }
  
  // Generate hash for cache key
  const cacheKey = CryptoJS.SHA256(text).toString();
  
  // Check cache first
  const cachedResult = emotionCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }
  
  // Not in cache, perform analysis
  const sentimentScores = getSentiment(text);
  const { dominantEmotion, confidence, emotionScores } = mapToEmotion(sentimentScores);
  
  // Create result
  const result = {
    dominantEmotion,
    confidence,
    color: EMOTION_COLORS[dominantEmotion] || EMOTION_COLORS.neutral,
    scores: sentimentScores,
    emotionScores
  };
  
  // Cache result
  emotionCache.put(cacheKey, result);
  
  // Store in encrypted local storage for trend analysis
  emotionStorage.setItem(cacheKey, {
    dominantEmotion,
    confidence,
    timestamp: Date.now()
  });
  
  return result;
};

/**
 * Returns CSS border style for a given emotion
 */
export const getEmotionBorder = (emotion) => {
  return EMOTION_BORDERS[emotion] || EMOTION_BORDERS.neutral;
};

/**
 * Returns the color code for a given emotion
 */
export const getEmotionColor = (emotion) => {
  return EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
};

/**
 * Analyzes emotion trends from local cache over past 24h
 */
export const getEmotionTrend = () => {
  try {
    const emotions = { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0, neutral: 0 };
    let total = 0;
    
    // Iterate through local storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('truevibe_emotion_')) {
        try {
          const encryptedData = localStorage.getItem(key);
          const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
          const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          
          // Only consider last 24 hours
          if (Date.now() - data.timestamp <= 86400000) {
            emotions[data.value.dominantEmotion] += 1;
            total += 1;
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    });
    
    // Calculate percentages
    const result = {};
    if (total > 0) {
      Object.keys(emotions).forEach(emotion => {
        result[emotion] = (emotions[emotion] / total) * 100;
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing emotion trends:', error);
    return {};
  }
};
