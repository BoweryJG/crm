-- Create call_recordings table
CREATE TABLE IF NOT EXISTS call_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_sid TEXT NOT NULL UNIQUE,
  call_sid TEXT NOT NULL,
  media_url TEXT NOT NULL,
  duration INTEGER,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  practice_id UUID REFERENCES practices(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending_download',
  analysis_status TEXT DEFAULT 'pending',
  analysis_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_call_recordings_contact_id ON call_recordings(contact_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_call_sid ON call_recordings(call_sid);

-- Create storage bucket for recordings if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('call_recordings', 'call_recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for the bucket
CREATE POLICY "Authenticated users can upload recordings" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'call_recordings');

CREATE POLICY "Authenticated users can download their recordings" 
ON storage.objects FOR SELECT TO authenticated 
USING (bucket_id = 'call_recordings');
