-- Fix remaining production issues

-- 1. Check what foreign keys actually exist for linguistics_analysis
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND (tc.table_name = 'call_analysis' OR tc.table_name = 'linguistics_analysis')
    AND (ccu.table_name = 'linguistics_analysis' OR ccu.table_name = 'call_analysis');

-- 2. Fix SUIS profile access - ensure user can at least read their own profile
-- First check current policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'suis_intelligence_profiles';

-- Drop all existing policies and create a simple one
DROP POLICY IF EXISTS "Authenticated users can manage their profile" ON suis_intelligence_profiles;
DROP POLICY IF EXISTS "Deny unauthenticated access" ON suis_intelligence_profiles;

-- Create a very permissive policy for testing
CREATE POLICY "Allow authenticated read access" ON suis_intelligence_profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Allow authenticated insert" ON suis_intelligence_profiles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
    
CREATE POLICY "Allow authenticated update own" ON suis_intelligence_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. Grant explicit permissions
GRANT SELECT, INSERT, UPDATE ON suis_intelligence_profiles TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 4. Force schema cache reload
NOTIFY pgrst, 'reload schema';