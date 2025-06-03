
import vaderSentiment from 'vader-sentiment';

class EmotionDetectionEngine {
  constructor() {
    this.emotionKeywords = {
      joy: {
        patterns: ['happy', 'excited', 'thrilled', 'amazing', 'wonderful', 'celebration', 'awesome', 'fantastic', 'great', 'love', 'perfect', 'brilliant', 'excellent', 'delighted', 'overjoyed'],
        emojis: ['😊', '😄', '🎉', '🚀', '❤️', '😍', '🥳', '✨', '🌟', '💫'],
        weight: 1.2
      },
      trust: {
        patterns: ['believe', 'confident', 'reliable', 'support', 'faith', 'loyal', 'honest', 'trustworthy', 'dependable', 'secure', 'certain', 'sure'],
        emojis: ['🤝', '💪', '👍', '✅', '🙏'],
        weight: 1.0
      },
      fear: {
        patterns: ['worried', 'scared', 'anxious', 'nervous', 'afraid', 'terrified', 'panic', 'stress', 'concern', 'frightened', 'alarmed'],
        emojis: ['😰', '😱', '😨', '😟', '😧', '🙈'],
        weight: 1.1
      },
      surprise: {
        patterns: ['wow', 'unexpected', 'shocked', 'amazed', 'sudden', 'surprising', 'unbelievable', 'incredible', 'omg', 'whoa'],
        emojis: ['😱', '😲', '🤯', '😮', '🙀', '‼️'],
        weight: 1.1
      },
      sadness: {
        patterns: ['sad', 'depressed', 'heartbroken', 'crying', 'grief', 'disappointed', 'lonely', 'miserable', 'devastated', 'upset'],
        emojis: ['😢', '😭', '😞', '😔', '💔', '😿'],
        weight: 0.9
      },
      disgust: {
        patterns: ['gross', 'disgusting', 'revolting', 'sick', 'horrible', 'awful', 'terrible', 'nasty', 'repulsive'],
        emojis: ['🤮', '😷', '🤢', '😖', '🙄'],
        weight: 0.8
      },
      anger: {
        patterns: ['angry', 'furious', 'mad', 'rage', 'frustrated', 'annoyed', 'outraged', 'livid', 'pissed', 'hate'],
        emojis: ['😡', '🤬', '😠', '👿', '💢', '🔥'],
        weight: 1.0
      },
      anticipation: {
        patterns: ['excited', 'looking forward', 'can\'t wait', 'upcoming', 'soon', 'eager', 'hopeful', 'expecting', 'anticipating'],
        emojis: ['⏰', '🔜', '👀', '🎯', '🚀'],
        weight: 1.1
      }
    };

    this.intensityModifiers = {
      amplifiers: {
        'very': 1.4, 'extremely': 1.6, 'incredibly': 1.5, 'absolutely': 1.5, 
        'totally': 1.3, 'really': 1.2, 'so': 1.3, 'super': 1.4, 'highly': 1.3,
        'completely': 1.5, 'utterly': 1.6, 'truly': 1.2, 'genuinely': 1.2
      },
      diminishers: {
        'slightly': 0.7, 'somewhat': 0.8, 'kinda': 0.8, 'little': 0.7, 
        'bit': 0.8, 'barely': 0.6, 'hardly': 0.6, 'mildly': 0.7, 'fairly': 0.9
      }
    };
  }

  analyzeEmotion(text) {
    // Step 1: Get VADER sentiment scores
    const vaderResult = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(text);
    
    // Step 2: Extract emotion-specific patterns
    const emotionScores = this.extractEmotionScores(text);
    
    // Step 3: Calculate intensity modifiers
    const intensity = this.calculateIntensity(text);
    
    // Step 4: Map to Plutchik emotions
    const emotionMapping = this.mapToPlutchikEmotions(vaderResult, emotionScores, intensity);
    
    return {
      primary: emotionMapping.primary,
      confidence: emotionMapping.confidence,
      secondary: emotionMapping.secondary,
      intensity: intensity,
      rawScores: vaderResult
    };
  }

  extractEmotionScores(text) {
    const scores = new Map();
    const lowerText = text.toLowerCase();
    
    Object.entries(this.emotionKeywords).forEach(([emotion, config]) => {
      let emotionScore = 0;
      
      // Check for keyword patterns
      config.patterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        const matches = (text.match(regex) || []).length;
        emotionScore += matches * 0.3;
      });
      
      // Check for emojis
      config.emojis.forEach(emoji => {
        const matches = (text.match(new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        emotionScore += matches * 0.4;
      });
      
      // Apply emotion weight
      emotionScore *= config.weight;
      
      if (emotionScore > 0) {
        scores.set(emotion, emotionScore);
      }
    });
    
    return scores;
  }

  calculateIntensity(text) {
    let intensity = 1.0;
    const words = text.toLowerCase().split(/\W+/);
    
    // Check for amplifiers
    Object.entries(this.intensityModifiers.amplifiers).forEach(([word, multiplier]) => {
      if (words.includes(word)) {
        intensity *= multiplier;
      }
    });
    
    // Check for diminishers
    Object.entries(this.intensityModifiers.diminishers).forEach(([word, multiplier]) => {
      if (words.includes(word)) {
        intensity *= multiplier;
      }
    });
    
    // Cap and floor intensity
    return Math.max(0.1, Math.min(2.5, intensity));
  }

  mapToPlutchikEmotions(vaderScores, emotionScores, intensity) {
    // Combine VADER with emotion-specific scores
    const combinedScores = new Map();
    
    // Map VADER compound score to basic emotions
    if (vaderScores.compound > 0.5) {
      combinedScores.set('joy', vaderScores.compound * 0.8);
    } else if (vaderScores.compound < -0.5) {
      if (vaderScores.neg > 0.6) {
        combinedScores.set('anger', Math.abs(vaderScores.compound) * 0.7);
      } else {
        combinedScores.set('sadness', Math.abs(vaderScores.compound) * 0.7);
      }
    }
    
    // Add emotion-specific scores
    emotionScores.forEach((score, emotion) => {
      const existing = combinedScores.get(emotion) || 0;
      combinedScores.set(emotion, existing + score);
    });
    
    // Sort emotions by score
    const sortedEmotions = Array.from(combinedScores.entries())
      .sort(([,a], [,b]) => b - a);
    
    if (sortedEmotions.length === 0) {
      return { primary: 'trust', confidence: 0.1 };
    }
    
    const [primaryEmotion, primaryScore] = sortedEmotions[0];
    const confidence = Math.min(0.95, Math.max(0.1, primaryScore * intensity * 0.4));
    
    const secondary = sortedEmotions.length > 1 && sortedEmotions[1][1] > primaryScore * 0.6
      ? sortedEmotions[1][0]
      : undefined;
    
    return {
      primary: primaryEmotion,
      confidence,
      secondary
    };
  }
}

export default EmotionDetectionEngine;
