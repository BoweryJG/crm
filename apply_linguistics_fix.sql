-- SQL script to apply the linguistics analysis fix
-- Created: May 24, 2025

-- Ensure linguistics_analysis table exists
CREATE TABLE IF NOT EXISTS linguistics_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT,
  analysis_result JSONB,
  sentiment_score NUMERIC,
  key_phrases TEXT[],
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  call_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add source_type column to distinguish between uploaded and Twilio recordings
ALTER TABLE linguistics_analysis 
ADD COLUMN IF NOT EXISTS source_type TEXT CHECK (source_type IN ('upload', 'twilio', 'other'));

-- Fix the foreign key constraint between call_analysis and linguistics_analysis
ALTER TABLE call_analysis
DROP CONSTRAINT IF EXISTS call_analysis_linguistics_analysis_id_fkey;

-- Add the proper foreign key constraint
ALTER TABLE call_analysis
ADD CONSTRAINT call_analysis_linguistics_analysis_id_fkey 
  FOREIGN KEY (linguistics_analysis_id) 
  REFERENCES linguistics_analysis(id) 
  ON DELETE SET NULL;

-- Add call_sid column to call_analysis if it doesn't exist
ALTER TABLE call_analysis
ADD COLUMN IF NOT EXISTS call_sid TEXT;

-- Create index on linguistics_analysis_id in call_analysis
CREATE INDEX IF NOT EXISTS idx_call_analysis_linguistics_analysis_id 
ON call_analysis(linguistics_analysis_id);

-- Create index on call_id in linguistics_analysis
CREATE INDEX IF NOT EXISTS idx_linguistics_analysis_call_id 
ON linguistics_analysis(call_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_linguistics_analysis_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for linguistics_analysis table
DROP TRIGGER IF EXISTS set_timestamp_linguistics_analysis ON linguistics_analysis;
CREATE TRIGGER set_timestamp_linguistics_analysis
BEFORE UPDATE ON linguistics_analysis
FOR EACH ROW EXECUTE PROCEDURE update_linguistics_analysis_modified_column();

-- Enable RLS on linguistics_analysis table
ALTER TABLE linguistics_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view linguistics_analysis (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'linguistics_analysis' 
    AND policyname = 'Authenticated users can view linguistics_analysis'
  ) THEN
    CREATE POLICY "Authenticated users can view linguistics_analysis"
      ON linguistics_analysis FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Create policy for authenticated users to insert linguistics_analysis (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'linguistics_analysis' 
    AND policyname = 'Authenticated users can insert linguistics_analysis'
  ) THEN
    CREATE POLICY "Authenticated users can insert linguistics_analysis"
      ON linguistics_analysis FOR INSERT
      WITH CHECK (true);
  END IF;
END
$$;

-- Create policy for authenticated users to update linguistics_analysis (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'linguistics_analysis' 
    AND policyname = 'Authenticated users can update linguistics_analysis'
  ) THEN
    CREATE POLICY "Authenticated users can update linguistics_analysis"
      ON linguistics_analysis FOR UPDATE
      USING (true);
  END IF;
END
$$;
