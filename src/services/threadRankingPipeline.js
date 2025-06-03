
import { supabase } from './supabase';

class ThreadRankingPipeline {
  async rankCandidates(candidates, userId, limit = 50) {
    // Step 1: Extract features for all candidates
    const candidatesWithFeatures = await this.extractFeatures(candidates, userId);
    
    // Step 2: Light Ranker (reduce from thousands to hundreds)
    const lightRanked = this.lightRanker(candidatesWithFeatures);
    
    // Step 3: Heavy Ranker (ML-based scoring on top candidates)
    const heavyRanked = await this.heavyRanker(lightRanked.slice(0, 200), userId);
    
    // Step 4: Final filtering and diversity
    const finalRanked = this.applyFinalFilters(heavyRanked, userId);
    
    return finalRanked.slice(0, limit);
  }

  // Feature extraction for ranking
  async extractFeatures(candidates, userId) {
    const userSocialData = await this.getUserSocialData(userId);
    const userEmotionProfile = await this.getUserEmotionProfile(userId);
    
    return candidates.map(candidate => ({
      candidate,
      features: this.calculateFeatures(candidate, userSocialData, userEmotionProfile)
    }));
  }

  calculateFeatures(candidate, userSocialData, userEmotionProfile) {
    const now = Date.now();
    const threadAge = now - candidate.createdAt.getTime();
    const threadAgeHours = threadAge / (1000 * 60 * 60);
    
    return {
      // Temporal features
      threadAgeHours,
      hourOfDay: candidate.createdAt.getHours(),
      dayOfWeek: candidate.createdAt.getDay(),
      
      // Content features
      contentLength: candidate.content.length,
      hasHashtags: candidate.hashtags.length > 0,
      hashtagCount: candidate.hashtags.length,
      hasLinks: candidate.content.includes('http'),
      isReply: false,
      
      // Engagement features
      totalReactions: Object.values(candidate.engagementMetrics.reactions).reduce((a, b) => a + b, 0),
      reactionsPerHour: candidate.engagementMetrics.reactionsPerHour,
      replyCount: candidate.engagementMetrics.replyCount,
      shareCount: candidate.engagementMetrics.shareCount,
      engagementVelocity: this.calculateEngagementVelocity(candidate),
      
      // Social features
      isFollowing: userSocialData.following.includes(candidate.userId),
      mutualConnections: userSocialData.mutualConnections[candidate.userId] || 0,
      authorFollowerCount: 1000,
      authorEngagementRate: 0.05,
      
      // Emotion features
      emotionConfidence: candidate.emotion.confidence,
      emotionAlignment: this.calculateEmotionAlignment(candidate.emotion, userEmotionProfile),
      emotionIntensity: candidate.emotion.intensity,
      
      // Quality features
      qualityScore: this.calculateQualityScore(candidate),
      toxicityScore: 0.1,
      spamScore: 0.05
    };
  }

  // Light Ranker Implementation (Twitter's fast heuristic approach)
  lightRanker(candidatesWithFeatures) {
    return candidatesWithFeatures.map(({ candidate, features }) => {
      let score = 0;
      
      // 1. Recency Score (exponential decay)
      const recencyScore = Math.exp(-features.threadAgeHours / 24) * 0.25;
      score += recencyScore;
      
      // 2. Engagement Score
      const engagementScore = Math.log(1 + features.totalReactions) * 0.15 +
                            Math.log(1 + features.reactionsPerHour) * 0.10 +
                            Math.log(1 + features.replyCount) * 0.08;
      score += engagementScore;
      
      // 3. Social Score
      let socialScore = 0;
      if (features.isFollowing) socialScore += 0.30;
      socialScore += Math.min(features.mutualConnections * 0.05, 0.15);
      score += socialScore;
      
      // 4. Content Quality Score
      const qualityScore = features.qualityScore * 0.15 - 
                          features.toxicityScore * 0.20 - 
                          features.spamScore * 0.25;
      score += qualityScore;
      
      // 5. Emotion Alignment Score (TrueVibe unique)
      const emotionScore = features.emotionAlignment * 0.12 + 
                          features.emotionConfidence * 0.08;
      score += emotionScore;
      
      // 6. Source Score Bonus
      const sourceBonus = candidate.sourceScore * 0.05;
      score += sourceBonus;
      
      return {
        candidate,
        features,
        lightRankScore: Math.max(0, score),
        heavyRankScore: 0,
        finalScore: 0
      };
    }).sort((a, b) => b.lightRankScore - a.lightRankScore);
  }

  // Heavy Ranker Implementation (ML-based)
  async heavyRanker(lightRanked, userId) {
    const userContext = await this.getUserContext(userId);
    
    return lightRanked.map(ranked => {
      const features = ranked.features;
      
      // Simulate ML model prediction with weighted feature combination
      let mlScore = 0;
      
      // Engagement prediction component
      const engagementProb = this.predictEngagementProbability(features, userContext);
      mlScore += engagementProb * 0.35;
      
      // Dwell time prediction component  
      const dwellTimeProb = this.predictDwellTime(features, userContext);
      mlScore += dwellTimeProb * 0.25;
      
      // Positive reaction prediction
      const positiveReactionProb = this.predictPositiveReaction(features, userContext);
      mlScore += positiveReactionProb * 0.20;
      
      // Share/amplify prediction
      const shareProb = this.predictShareProbability(features, userContext);
      mlScore += shareProb * 0.20;
      
      // Combine light rank and ML scores
      const finalScore = ranked.lightRankScore * 0.4 + mlScore * 0.6;
      
      return {
        ...ranked,
        heavyRankScore: mlScore,
        finalScore
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }

  // ML prediction simulations
  predictEngagementProbability(features, userContext) {
    let prob = 0.1; // Base probability
    
    // Social signals
    if (features.isFollowing) prob += 0.3;
    prob += Math.min(features.mutualConnections * 0.05, 0.2);
    
    // Content signals
    if (features.hasHashtags && userContext.likesHashtags) prob += 0.15;
    if (features.contentLength > 50 && features.contentLength < 200) prob += 0.1;
    
    // Emotion signals
    prob += features.emotionAlignment * 0.2;
    prob += features.emotionConfidence * 0.1;
    
    // Quality signals
    prob += features.qualityScore * 0.15;
    prob -= features.toxicityScore * 0.3;
    
    // Temporal signals
    if (this.isUserActiveTime(features.hourOfDay, userContext)) prob += 0.1;
    
    return Math.max(0, Math.min(1, prob));
  }

  predictDwellTime(features, userContext) {
    let prob = 0.15; // Base probability for >30s dwell time
    
    // Content length correlation with dwell time
    if (features.contentLength > 100) prob += 0.2;
    if (features.contentLength > 200) prob += 0.1;
    
    // Emotion intensity correlation
    prob += features.emotionIntensity * 0.15;
    
    // Quality content tends to have longer dwell times
    prob += features.qualityScore * 0.2;
    
    // Social proof
    prob += Math.log(1 + features.totalReactions) * 0.1;
    
    return Math.max(0, Math.min(1, prob));
  }

  predictPositiveReaction(features, userContext) {
    let prob = 0.05; // Base probability
    
    // Strong emotion alignment increases positive reaction likelihood
    prob += features.emotionAlignment * 0.4;
    
    // High confidence emotions
    if (features.emotionConfidence > 0.7) prob += 0.2;
    
    // Social signals
    if (features.isFollowing) prob += 0.25;
    
    // Already popular content
    prob += Math.min(features.reactionsPerHour * 0.02, 0.3);
    
    return Math.max(0, Math.min(1, prob));
  }

  predictShareProbability(features, userContext) {
    let prob = 0.02; // Base probability (sharing is rare)
    
    // High-quality, emotional content gets shared more
    if (features.emotionIntensity > 1.5 && features.qualityScore > 0.7) prob += 0.15;
    
    // Trending content
    if (features.totalReactions > 10) prob += 0.1;
    
    // Trusted sources
    if (features.isFollowing && features.authorEngagementRate > 0.1) prob += 0.08;
    
    return Math.max(0, Math.min(1, prob));
  }

  // Apply final filters and diversity
  applyFinalFilters(ranked, userId) {
    let filtered = [...ranked];
    
    // 1. Author diversity - max 2 threads per author in top 30
    filtered = this.applyAuthorDiversity(filtered);
    
    // 2. Emotion diversity - prevent emotion fatigue
    filtered = this.applyEmotionDiversity(filtered);
    
    // 3. Content type balance
    filtered = this.applyContentBalance(filtered);
    
    return filtered;
  }

  applyAuthorDiversity(candidates) {
    const authorCounts = new Map();
    const diverseResults = [];
    
    for (const candidate of candidates) {
      const authorId = candidate.candidate.userId;
      const currentCount = authorCounts.get(authorId) || 0;
      
      // Allow max 2 threads per author in top 30, then unlimited
      if (diverseResults.length < 30 && currentCount < 2) {
        diverseResults.push(candidate);
        authorCounts.set(authorId, currentCount + 1);
      } else if (diverseResults.length >= 30) {
        diverseResults.push(candidate);
      }
    }
    
    return diverseResults;
  }

  applyEmotionDiversity(candidates) {
    const emotionCounts = new Map();
    const diverseResults = [];
    
    for (const candidate of candidates) {
      const emotion = candidate.candidate.emotion.primary;
      const currentCount = emotionCounts.get(emotion) || 0;
      
      // Prevent more than 3 consecutive same emotions
      if (currentCount < 3 || candidate.finalScore > 0.8) {
        diverseResults.push(candidate);
        emotionCounts.set(emotion, currentCount + 1);
      }
    }
    
    return diverseResults;
  }

  applyContentBalance(candidates) {
    // Ensure balance between in-network and out-of-network content
    const inNetwork = candidates.filter(c => c.candidate.source === 'in_network');
    const outOfNetwork = candidates.filter(c => c.candidate.source !== 'in_network');
    
    const balanced = [];
    const maxLength = Math.max(inNetwork.length, outOfNetwork.length);
    
    // Interleave 60% in-network, 40% out-of-network
    for (let i = 0; i < maxLength; i++) {
      if (i < inNetwork.length && balanced.filter(c => c.candidate.source === 'in_network').length < candidates.length * 0.6) {
        balanced.push(inNetwork[i]);
      }
      if (i < outOfNetwork.length && balanced.filter(c => c.candidate.source !== 'in_network').length < candidates.length * 0.4) {
        balanced.push(outOfNetwork[i]);
      }
    }
    
    return balanced;
  }

  // Helper functions
  calculateEngagementVelocity(candidate) {
    const ageHours = (Date.now() - candidate.createdAt.getTime()) / (1000 * 60 * 60);
    const totalEngagement = Object.values(candidate.engagementMetrics.reactions).reduce((a, b) => a + b, 0) +
                           candidate.engagementMetrics.replyCount +
                           candidate.engagementMetrics.shareCount;
    
    return totalEngagement / Math.max(ageHours, 1);
  }

  calculateEmotionAlignment(emotion, userProfile) {
    if (!userProfile || !userProfile.dominantEmotions) return 0.5;
    
    const emotionWeights = {
      [emotion.primary]: 1.0,
      [emotion.secondary || '']: 0.6
    };
    
    let alignment = 0;
    userProfile.dominantEmotions.forEach((userEmotion, index) => {
      const weight = 1.0 - (index * 0.2);
      if (emotionWeights[userEmotion]) {
        alignment += emotionWeights[userEmotion] * weight;
      }
    });
    
    return Math.min(1, alignment / userProfile.dominantEmotions.length);
  }

  calculateQualityScore(candidate) {
    let score = 0.5; // Base score
    
    // Content length sweet spot
    if (candidate.content.length > 30 && candidate.content.length < 250) score += 0.2;
    
    // Has hashtags but not too many
    if (candidate.hashtags.length > 0 && candidate.hashtags.length <= 3) score += 0.1;
    
    // Good engagement relative to age
    if (candidate.engagementMetrics.reactionsPerHour > 1) score += 0.2;
    
    // High emotion confidence
    if (candidate.emotion.confidence > 0.7) score += 0.1;
    
    return Math.min(1, score);
  }

  async getUserSocialData(userId) {
    return {
      following: [],
      mutualConnections: {}
    };
  }

  async getUserEmotionProfile(userId) {
    return { dominantEmotions: ['joy', 'trust', 'anticipation'] };
  }

  async getUserContext(userId) {
    return {
      likesHashtags: true,
      activeHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      preferredContentLength: 150
    };
  }

  isUserActiveTime(hour, userContext) {
    return userContext.activeHours?.includes(hour) || false;
  }
}

export default ThreadRankingPipeline;
