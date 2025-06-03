
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  avatar_url TEXT,
  adjective_one TEXT,
  adjective_two TEXT,
  adjective_three TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  emotion TEXT,
  emotion_score DECIMAL DEFAULT 0,
  hashtags TEXT[] DEFAULT '{}',
  media_url TEXT,
  media_type TEXT,
  reaction_counts JSONB DEFAULT '{}',
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('resonate', 'support', 'learn', 'challenge', 'amplify')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  media_url TEXT,
  emotion_theme TEXT,
  privacy TEXT DEFAULT 'public' CHECK (privacy IN ('public', 'friends')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tag TEXT UNIQUE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user thread interactions table for advanced tracking
CREATE TABLE IF NOT EXISTS user_thread_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('reaction', 'view', 'share', 'reply')),
  interaction_subtype TEXT, -- For reaction types: resonate, support, learn, challenge, amplify
  device_type TEXT DEFAULT 'web',
  session_id TEXT,
  source_location TEXT DEFAULT 'feed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, thread_id, interaction_type, interaction_subtype)
);

-- Create user emotion profiles table
CREATE TABLE IF NOT EXISTS user_emotion_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  joy_preference DECIMAL DEFAULT 0.5,
  trust_preference DECIMAL DEFAULT 0.5,
  fear_preference DECIMAL DEFAULT 0.5,
  surprise_preference DECIMAL DEFAULT 0.5,
  sadness_preference DECIMAL DEFAULT 0.5,
  disgust_preference DECIMAL DEFAULT 0.5,
  anger_preference DECIMAL DEFAULT 0.5,
  anticipation_preference DECIMAL DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user follows table for social features
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_user_id, following_user_id)
);

-- Create user blocks table
CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_user_id, blocked_user_id)
);

-- Create hashtag trending metrics table
CREATE TABLE IF NOT EXISTS hashtag_trending_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hashtag TEXT UNIQUE NOT NULL,
  mention_count_1h INTEGER DEFAULT 0,
  mention_count_24h INTEGER DEFAULT 0,
  unique_users_1h INTEGER DEFAULT 0,
  velocity_1h DECIMAL DEFAULT 0,
  trending_score DECIMAL DEFAULT 0,
  emotion_distribution JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_emotion ON threads(emotion);
CREATE INDEX IF NOT EXISTS idx_reactions_thread_id ON reactions(thread_id);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_hashtags_tag ON hashtags(tag);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_thread_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_thread_id ON user_thread_interactions(thread_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_thread_interactions(interaction_type, interaction_subtype);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_user_id);
CREATE INDEX IF NOT EXISTS idx_hashtag_trending_score ON hashtag_trending_metrics(trending_score DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_thread_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emotion_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_trending_metrics ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Threads policies
CREATE POLICY "Public threads are viewable by everyone" ON threads FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);
CREATE POLICY "Users can insert own threads" ON threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own threads" ON threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own threads" ON threads FOR DELETE USING (auth.uid() = user_id);

-- Reactions policies
CREATE POLICY "Anyone can view reactions" ON reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Stories policies
CREATE POLICY "Users can view public stories" ON stories FOR SELECT USING (
  privacy = 'public' OR user_id = auth.uid()
);
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

-- Hashtags policies
CREATE POLICY "Users can view all hashtags" ON hashtags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert hashtags" ON hashtags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update hashtags" ON hashtags FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, username)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update hashtag counts
CREATE OR REPLACE FUNCTION update_hashtag_count(tag_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO hashtags (tag, count)
  VALUES (tag_name, 1)
  ON CONFLICT (tag)
  DO UPDATE SET 
    count = hashtags.count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('user-content', 'user-content', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thread-images', 'thread-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true) ON CONFLICT DO NOTHING;

-- Storage policies for user-content bucket
CREATE POLICY "Anyone can view user content" ON storage.objects FOR SELECT USING (bucket_id = 'user-content');
CREATE POLICY "Users can upload user content" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-content' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own user content" ON storage.objects FOR UPDATE USING (bucket_id = 'user-content' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own user content" ON storage.objects FOR DELETE USING (bucket_id = 'user-content' AND auth.uid()::text = (storage.foldername(name))[1]);
