-- Force fix SUIS policies - complete reset

-- 1. First drop ALL existing policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'suis_intelligence_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON suis_intelligence_profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Ensure RLS is enabled
ALTER TABLE suis_intelligence_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies with explicit role specification
-- Using the standard Supabase approach
CREATE POLICY "Enable read access for authenticated users" ON suis_intelligence_profiles
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" ON suis_intelligence_profiles
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON suis_intelligence_profiles
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON suis_intelligence_profiles
    AS PERMISSIVE
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. Grant table permissions
GRANT ALL ON suis_intelligence_profiles TO authenticated;
GRANT ALL ON suis_intelligence_profiles TO service_role;

-- 5. Check the policies were created correctly
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