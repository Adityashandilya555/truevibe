
-- Create storage buckets for TrueVibe
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('user-content', 'user-content', true),
  ('thread_media', 'thread_media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view public files" ON storage.objects FOR SELECT USING (bucket_id IN ('user-content', 'thread_media'));
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id IN ('user-content', 'thread_media'));
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id IN ('user-content', 'thread_media'));
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id IN ('user-content', 'thread_media'));
