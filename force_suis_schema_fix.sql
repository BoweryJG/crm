-- Force Supabase to recognize the profile_type column
-- Run this in Supabase SQL editor

-- 1. Drop and recreate the RLS policy to force a refresh
DROP POLICY IF EXISTS "Users can manage own intelligence profile" ON suis_intelligence_profiles;

-- 2. Temporarily disable RLS
ALTER TABLE suis_intelligence_profiles DISABLE ROW LEVEL SECURITY;

-- 3. Add a comment to the column to force schema change detection
COMMENT ON COLUMN suis_intelligence_profiles.profile_type IS 'User profile type - rep, manager, or executive';

-- 4. Re-enable RLS
ALTER TABLE suis_intelligence_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Recreate the policy
CREATE POLICY "Users can manage own intelligence profile" ON suis_intelligence_profiles
    FOR ALL USING (auth.uid() = user_id);

-- 6. Create a function that explicitly uses the profile_type column
CREATE OR REPLACE FUNCTION get_user_profile_type(user_id_param UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT profile_type FROM suis_intelligence_profiles WHERE user_id = user_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Force PostgREST to reload
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

-- 8. Wait a moment and then test
DO $$ 
BEGIN
    PERFORM pg_sleep(1);
END $$;

-- 9. Test the column is accessible
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'suis_intelligence_profiles'
AND column_name = 'profile_type';

-- 10. Alternative: Create a view that explicitly includes the column
CREATE OR REPLACE VIEW suis_intelligence_profiles_view AS
SELECT 
    id,
    user_id,
    profile_type::VARCHAR(50) as profile_type,  -- Explicitly cast to ensure it's recognized
    specializations,
    territory_ids,
    goals,
    preferences,
    ai_settings,
    performance_baseline,
    created_at,
    updated_at
FROM suis_intelligence_profiles;

-- Grant access to the view
GRANT SELECT ON suis_intelligence_profiles_view TO anon, authenticated;