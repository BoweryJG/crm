-- Fix SUIS RLS policies to handle edge cases better
-- This prevents 400/406 errors when queries are made without proper context

-- First, ensure the table exists and has proper structure
DO $$
BEGIN
    -- Check if the table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suis_intelligence_profiles') THEN
        -- Drop all existing policies
        DROP POLICY IF EXISTS "Users can manage own intelligence profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can view own profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can create own profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can delete own profile" ON suis_intelligence_profiles;
        
        -- Create a single comprehensive policy for authenticated users
        CREATE POLICY "Authenticated users can manage their profile" ON suis_intelligence_profiles
            FOR ALL 
            USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
            WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
        
        -- Add a policy to prevent queries without authentication
        CREATE POLICY "Deny unauthenticated access" ON suis_intelligence_profiles
            FOR ALL
            USING (auth.uid() IS NOT NULL);
            
        RAISE NOTICE 'SUIS RLS policies updated successfully';
    ELSE
        RAISE NOTICE 'Table suis_intelligence_profiles does not exist. Please run the SUIS schema migration first.';
    END IF;
END $$;

-- Also update other SUIS tables to ensure consistent RLS
DO $$
DECLARE
    tbl TEXT;
    suis_tables TEXT[] := ARRAY[
        'suis_market_intelligence',
        'suis_market_trends', 
        'suis_unified_analytics',
        'suis_performance_scores',
        'suis_contact_universe',
        'suis_contact_engagements',
        'suis_research_queries',
        'suis_knowledge_base',
        'suis_generated_content',
        'suis_content_performance',
        'suis_call_intelligence',
        'suis_call_analytics',
        'suis_notifications',
        'suis_notification_rules',
        'suis_learning_paths',
        'suis_learning_progress'
    ];
BEGIN
    FOREACH tbl IN ARRAY suis_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
            -- Ensure RLS is enabled
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
            
            -- Grant permissions to authenticated users
            EXECUTE format('GRANT ALL ON %I TO authenticated', tbl);
            
            RAISE NOTICE 'Updated RLS for table: %', tbl;
        END IF;
    END LOOP;
END $$;