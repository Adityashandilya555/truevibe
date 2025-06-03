
-- Copy these SQL functions into your Supabase SQL editor

-- Function to increment reaction counts atomically
CREATE OR REPLACE FUNCTION increment_reaction_count(thread_id UUID, reaction_type TEXT)
RETURNS void AS $$
BEGIN
  UPDATE threads 
  SET reaction_counts = jsonb_set(
    COALESCE(reaction_counts, '{}'::jsonb), 
    ARRAY[reaction_type], 
    (COALESCE((reaction_counts->>reaction_type)::integer, 0) + 1)::text::jsonb
  )
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement reaction counts atomically
CREATE OR REPLACE FUNCTION decrement_reaction_count(thread_id UUID, reaction_type TEXT)
RETURNS void AS $$
BEGIN
  UPDATE threads 
  SET reaction_counts = jsonb_set(
    COALESCE(reaction_counts, '{}'::jsonb), 
    ARRAY[reaction_type], 
    (GREATEST(COALESCE((reaction_counts->>reaction_type)::integer, 0) - 1, 0))::text::jsonb
  )
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update user emotion preferences
CREATE OR REPLACE FUNCTION adjust_emotion_preference(
  user_id UUID, 
  emotion TEXT, 
  adjustment FLOAT
)
RETURNS void AS $$
DECLARE
  preference_column TEXT;
  current_value FLOAT;
  new_value FLOAT;
BEGIN
  preference_column := emotion || '_preference';
  
  -- Get current preference (we'll store this in user_metadata for now)
  current_value := 0.5; -- Default preference
  
  -- Calculate new value (clamped between 0 and 1)
  new_value := GREATEST(0, LEAST(1, current_value + adjustment));
  
  -- For demo purposes, we'll just log this
  RAISE NOTICE 'Adjusting % preference for user % by % (new value: %)', emotion, user_id, adjustment, new_value;
END;
$$ LANGUAGE plpgsql;

-- Function to update hashtag trending metrics
CREATE OR REPLACE FUNCTION update_hashtag_trending(
  hashtag TEXT,
  emotion TEXT,
  reaction_type TEXT,
  timestamp TIMESTAMPTZ
)
RETURNS void AS $$
BEGIN
  -- For demo purposes, we'll just log this
  RAISE NOTICE 'Updating trending for hashtag % with emotion % and reaction %', hashtag, emotion, reaction_type;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate trending scores (run periodically)
CREATE OR REPLACE FUNCTION calculate_trending_scores()
RETURNS void AS $$
BEGIN
  -- For demo purposes, we'll just log this
  RAISE NOTICE 'Calculating trending scores';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for these functions
GRANT EXECUTE ON FUNCTION increment_reaction_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION decrement_reaction_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION adjust_emotion_preference TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_hashtag_trending TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_trending_scores TO anon, authenticated;
