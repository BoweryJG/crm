-- Clean up duplicate policies - remove the public role policies

-- Drop the problematic public role policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON suis_intelligence_profiles;
DROP POLICY IF EXISTS "Allow authenticated read access" ON suis_intelligence_profiles;
DROP POLICY IF EXISTS "Allow authenticated update own" ON suis_intelligence_profiles;

-- Verify only authenticated policies remain
SELECT 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'suis_intelligence_profiles'
ORDER BY policyname;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';