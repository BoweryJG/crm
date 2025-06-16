-- Fix SUIS schema cache issue by refreshing the schema
-- This will help Supabase recognize the existing profile_type column

-- Refresh the schema cache for the suis_intelligence_profiles table
NOTIFY pgrst, 'reload schema';

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'suis_intelligence_profiles'
ORDER BY ordinal_position;

-- Ensure RLS is properly configured
ALTER TABLE suis_intelligence_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate the RLS policy to ensure it's properly registered
DROP POLICY IF EXISTS "Users can manage own intelligence profile" ON suis_intelligence_profiles;
CREATE POLICY "Users can manage own intelligence profile" ON suis_intelligence_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Insert a test record to ensure the table is accessible
-- (This will be rolled back, just for testing)
BEGIN;
INSERT INTO suis_intelligence_profiles (user_id, profile_type) 
VALUES (auth.uid(), 'rep')
ON CONFLICT (user_id) DO NOTHING;
ROLLBACK;

-- Force schema cache refresh
SELECT pg_notify('pgrst', 'reload schema');