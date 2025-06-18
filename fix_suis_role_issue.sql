-- Fix SUIS role issue - policies are using 'public' instead of 'authenticated'

-- Drop the existing policy that's using the wrong role
DROP POLICY IF EXISTS "Authenticated users can manage their profile" ON suis_intelligence_profiles;

-- Create new policies with the correct 'authenticated' role
CREATE POLICY "Users can view own profile" ON suis_intelligence_profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON suis_intelligence_profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON suis_intelligence_profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Also create a policy for service role if needed
CREATE POLICY "Service role has full access" ON suis_intelligence_profiles
    FOR ALL
    TO service_role
    USING (true);

-- Ensure proper grants
GRANT ALL ON suis_intelligence_profiles TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Check the result
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'suis_intelligence_profiles';