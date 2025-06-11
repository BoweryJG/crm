-- Migration to add support for external recording sources (PLAUD, manual uploads, etc.)

-- Add source column to indicate where the recording came from
ALTER TABLE call_recordings
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'twilio' CHECK (source IN ('twilio', 'plaud', 'manual', 'other'));

-- Add external_id column for storing external reference IDs (e.g., PLAUD recording ID)
ALTER TABLE call_recordings
ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Add file_name and file_size columns for external uploads
ALTER TABLE call_recordings
ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE call_recordings
ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- Add transcription column for storing full transcription text
ALTER TABLE call_recordings
ADD COLUMN IF NOT EXISTS transcription TEXT;

-- Make recording_sid nullable for external recordings (non-Twilio)
ALTER TABLE call_recordings
ALTER COLUMN recording_sid DROP NOT NULL;

-- Make call_sid nullable for external recordings
ALTER TABLE call_recordings
ALTER COLUMN call_sid DROP NOT NULL;

-- Make media_url nullable for external recordings
ALTER TABLE call_recordings
ALTER COLUMN media_url DROP NOT NULL;

-- Add constraint to ensure Twilio recordings have required fields
ALTER TABLE call_recordings
ADD CONSTRAINT check_twilio_fields CHECK (
  (source = 'twilio' AND recording_sid IS NOT NULL AND call_sid IS NOT NULL AND media_url IS NOT NULL)
  OR
  (source != 'twilio')
);

-- Add indexes for external recordings
CREATE INDEX IF NOT EXISTS idx_call_recordings_source ON call_recordings(source);
CREATE INDEX IF NOT EXISTS idx_call_recordings_external_id ON call_recordings(external_id);

-- Add comments
COMMENT ON COLUMN call_recordings.source IS 'Source of the recording: twilio, plaud, manual, other';
COMMENT ON COLUMN call_recordings.external_id IS 'External reference ID for non-Twilio recordings';
COMMENT ON COLUMN call_recordings.file_name IS 'Original filename for uploaded recordings';
COMMENT ON COLUMN call_recordings.file_size IS 'File size in bytes for uploaded recordings';
COMMENT ON COLUMN call_recordings.transcription IS 'Full transcription text from AI analysis';