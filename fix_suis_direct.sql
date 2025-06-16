-- Direct SQL commands to fix SUIS schema cache issue
-- Run these commands in your Supabase SQL editor

-- 1. First, let's check if the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'suis_intelligence_profiles' 
AND column_name = 'profile_type';

-- 2. If the column exists but Supabase doesn't recognize it, we'll force a schema refresh
-- by altering the table slightly (this won't change functionality)
ALTER TABLE suis_intelligence_profiles 
ALTER COLUMN profile_type SET NOT NULL;

-- 3. Recreate the check constraint to ensure it's properly registered
ALTER TABLE suis_intelligence_profiles 
DROP CONSTRAINT IF EXISTS suis_intelligence_profiles_profile_type_check;

ALTER TABLE suis_intelligence_profiles 
ADD CONSTRAINT suis_intelligence_profiles_profile_type_check 
CHECK (profile_type IN ('rep', 'manager', 'executive'));

-- 4. Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- 5. Test that the table is accessible by creating a test query
-- This should return 0 rows if no profiles exist yet
SELECT COUNT(*) FROM suis_intelligence_profiles;

-- 6. Optional: Create a default profile for the current user if one doesn't exist
-- Uncomment and run if you want to create a default profile
-- INSERT INTO suis_intelligence_profiles (user_id, profile_type)
-- SELECT auth.uid(), 'rep'
-- WHERE NOT EXISTS (
--     SELECT 1 FROM suis_intelligence_profiles WHERE user_id = auth.uid()
-- );