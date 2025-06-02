import { SentimentIntensityAnalyzer } from 'vader-sentiment';

const analyzer = new SentimentIntensityAnalyzer();

// Plutchik emotion mapping
const EMOTION_MAPPING = {
  joy: { keywords: ['happy', 'excited', 'amazing', 'love', 'wonderful'], threshold: 0.3 },
  trust: { keywords: ['believe', 'reliable', 'honest', 'support'], threshold: 0.2 },
  fear: { keywords: ['scared', 'worried', 'anxious', 'nervous'], threshold: -0.2 },
  surprise: { keywords: ['wow', 'unexpected', 'shocking', 'amazing'], threshold: 0.1 },
  sadness: { keywords: ['sad', 'depressed', 'down', 'upset'], threshold: -0.3 },
  disgust: { keywords: ['gross', 'disgusting', 'awful', 'terrible'], threshold: -0.4 },
  anger: { keywords: ['angry', 'mad', 'furious', 'hate'], threshold: -0.5 },
  anticipation: { keywords: ['excited', 'looking forward', 'can\'t wait'], threshold: 0.2 }
};

export const analyzeEmotion = async (text) => {
  const scores = analyzer.polarity_scores(text);
  
  // Determine dominant emotion based on keywords and sentiment
  let dominantEmotion = 'neutral';
  let confidence = 0;
  
  const lowerText = text.toLowerCase();
  
  for (const [emotion, config] of Object.entries(EMOTION_MAPPING)) {
    const keywordMatches = config.keywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;
    
    if (keywordMatches > 0) {
      const emotionScore = keywordMatches * 0.3 + Math.abs(scores.compound);
      if (emotionScore > confidence) {
        dominantEmotion = emotion;
        confidence = emotionScore;
      }
    }
  }
  
  // Fallback to sentiment-based emotion
  if (dominantEmotion === 'neutral') {
    if (scores.compound >= 0.3) dominantEmotion = 'joy';
    else if (scores.compound <= -0.3) dominantEmotion = 'sadness';
    else if (scores.compound <= -0.5) dominantEmotion = 'anger';
    
    confidence = Math.abs(scores.compound);
  }
  
  return {
    dominantEmotion,
    confidence: Math.min(confidence, 1),
    scores
  };
};
