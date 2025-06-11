-- Run this SQL in Supabase SQL Editor to set up API keys table

-- Create API Keys table for managing Sphere1a API keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  key_type TEXT NOT NULL CHECK (key_type IN ('sphere1a', 'openrouter', 'custom')),
  permissions JSONB DEFAULT '{"read": true, "write": true, "delete": false}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can create own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON api_keys;

-- RLS Policies
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key(prefix TEXT DEFAULT 'sk')
RETURNS TEXT AS $$
BEGIN
  RETURN prefix || '_' || encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(key TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  permissions JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (k.is_active AND (k.expires_at IS NULL OR k.expires_at > NOW())) as is_valid,
    k.user_id,
    k.permissions
  FROM api_keys k
  WHERE k.api_key = key
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;