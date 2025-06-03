
const LOCAL_STORAGE_KEYS = {
  USER: 'truevibe_user',
  THREADS: 'truevibe_threads',
  PROFILES: 'truevibe_profiles',
  STORIES: 'truevibe_stories',
  REACTIONS: 'truevibe_reactions'
};

// Generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Mock user data
const createMockUser = (email, username) => ({
  id: generateId(),
  email,
  username,
  created_at: new Date().toISOString(),
  user_metadata: {
    full_name: username,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
  }
});

const createMockProfile = (user) => ({
  id: user.id,
  user_id: user.id,
  email: user.email,
  username: user.username,
  avatar_url: user.user_metadata.avatar_url,
  adjective_one: 'Creative',
  adjective_two: 'Authentic',
  adjective_three: 'Empathetic',
  bio: 'Welcome to TrueVibe! Express your authentic self.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export const localAuth = {
  // Authentication methods
  signUp: async (email, password, username) => {
    try {
      const users = JSON.parse(localStorage.getItem('truevibe_all_users') || '[]');
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const user = createMockUser(email, username);
      const profile = createMockProfile(user);
      
      // Store user
      users.push({ ...user, password }); // In real app, hash the password
      localStorage.setItem('truevibe_all_users', JSON.stringify(users));
      
      // Store profile
      const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES) || '[]');
      profiles.push(profile);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      
      // Set current user
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
      
      return { user, profile, error: null };
    } catch (error) {
      return { user: null, profile: null, error: error.message };
    }
  },

  signIn: async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('truevibe_all_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Get profile
      const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES) || '[]');
      const profile = profiles.find(p => p.user_id === user.id);
      
      // Set current user
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
      
      return { user: userWithoutPassword, profile, error: null };
    } catch (error) {
      return { user: null, profile: null, error: error.message };
    }
  },

  signOut: async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    return { error: null };
  },

  getCurrentUser: async () => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null');
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  getCurrentProfile: async () => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null');
      if (!user) return { profile: null, error: 'No user logged in' };

      const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES) || '[]');
      const profile = profiles.find(p => p.user_id === user.id);
      
      return { profile, error: null };
    } catch (error) {
      return { profile: null, error: error.message };
    }
  },

  updateProfile: async (updates) => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null');
      if (!user) throw new Error('No user logged in');

      const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES) || '[]');
      const profileIndex = profiles.findIndex(p => p.user_id === user.id);
      
      if (profileIndex === -1) throw new Error('Profile not found');

      profiles[profileIndex] = {
        ...profiles[profileIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      return { profile: profiles[profileIndex], error: null };
    } catch (error) {
      return { profile: null, error: error.message };
    }
  }
};

// Thread management
export const localThreads = {
  createThread: async (content, emotion, mediaUrl = null) => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null');
      if (!user) throw new Error('No user logged in');

      const threads = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.THREADS) || '[]');
      const profile = await localAuth.getCurrentProfile();

      // Extract hashtags
      const hashtags = content.match(/#\w+/g) || [];

      const thread = {
        id: generateId(),
        user_id: user.id,
        content,
        emotion: emotion?.emotion || 'neutral',
        emotion_score: emotion?.score || 0,
        hashtags: hashtags.map(tag => tag.slice(1)),
        media_url: mediaUrl,
        media_type: mediaUrl ? 'image' : null,
        reaction_counts: {
          resonate: 0,
          support: 0,
          learn: 0,
          challenge: 0,
          amplify: 0
        },
        visibility: 'public',
        created_at: new Date().toISOString(),
        user_profiles: profile.profile
      };

      threads.unshift(thread);
      localStorage.setItem(LOCAL_STORAGE_KEYS.THREADS, JSON.stringify(threads));

      return { thread, error: null };
    } catch (error) {
      return { thread: null, error: error.message };
    }
  },

  getThreads: async (limit = 20, offset = 0) => {
    try {
      const threads = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.THREADS) || '[]');
      const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES) || '[]');

      // Attach user profiles
      const threadsWithProfiles = threads.map(thread => ({
        ...thread,
        user_profiles: profiles.find(p => p.user_id === thread.user_id)
      }));

      const paginatedThreads = threadsWithProfiles.slice(offset, offset + limit);
      return { threads: paginatedThreads, error: null };
    } catch (error) {
      return { threads: [], error: error.message };
    }
  },

  addReaction: async (threadId, reactionType) => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null');
      if (!user) throw new Error('No user logged in');

      const threads = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.THREADS) || '[]');
      const threadIndex = threads.findIndex(t => t.id === threadId);
      
      if (threadIndex === -1) throw new Error('Thread not found');

      // Check if user already reacted
      const reactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REACTIONS) || '[]');
      const existingReaction = reactions.find(r => r.thread_id === threadId && r.user_id === user.id);

      if (existingReaction) {
        // Remove old reaction count
        threads[threadIndex].reaction_counts[existingReaction.reaction_type]--;
        // Update reaction type
        existingReaction.reaction_type = reactionType;
      } else {
        // Add new reaction
        reactions.push({
          id: generateId(),
          thread_id: threadId,
          user_id: user.id,
          reaction_type: reactionType,
          created_at: new Date().toISOString()
        });
      }

      // Increment new reaction count
      threads[threadIndex].reaction_counts[reactionType]++;

      localStorage.setItem(LOCAL_STORAGE_KEYS.THREADS, JSON.stringify(threads));
      localStorage.setItem(LOCAL_STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));

      return { thread: threads[threadIndex], error: null };
    } catch (error) {
      return { thread: null, error: error.message };
    }
  }
};

// Stories management
export const localStories = {
  createStory: async (content, mediaUrl, emotionTheme) => {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null');
      if (!user) throw new Error('No user logged in');

      const stories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.STORIES) || '[]');
      
      const story = {
        id: generateId(),
        user_id: user.id,
        content,
        media_url: mediaUrl,
        emotion_theme: emotionTheme,
        privacy: 'public',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        created_at: new Date().toISOString()
      };

      stories.unshift(story);
      localStorage.setItem(LOCAL_STORAGE_KEYS.STORIES, JSON.stringify(stories));

      return { story, error: null };
    } catch (error) {
      return { story: null, error: error.message };
    }
  },

  getStories: async () => {
    try {
      const stories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.STORIES) || '[]');
      const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES) || '[]');
      
      // Filter out expired stories
      const now = new Date();
      const activeStories = stories.filter(story => new Date(story.expires_at) > now);
      
      // Update storage to remove expired stories
      localStorage.setItem(LOCAL_STORAGE_KEYS.STORIES, JSON.stringify(activeStories));

      // Attach user profiles
      const storiesWithProfiles = activeStories.map(story => ({
        ...story,
        user_profiles: profiles.find(p => p.user_id === story.user_id)
      }));

      return { stories: storiesWithProfiles, error: null };
    } catch (error) {
      return { stories: [], error: error.message };
    }
  }
};

export default localAuth;
