-- PRODUCTION FIX SCRIPT
-- Run this script on your Supabase production database to fix all identified issues

-- 1. Fix SUIS RLS policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suis_intelligence_profiles') THEN
        -- Drop existing policies
        DROP POLICY IF EXISTS "Users can manage own intelligence profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can view own profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can create own profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON suis_intelligence_profiles;
        DROP POLICY IF EXISTS "Users can delete own profile" ON suis_intelligence_profiles;
        
        -- Create a single comprehensive policy
        CREATE POLICY "Authenticated users can manage their profile" ON suis_intelligence_profiles
            FOR ALL 
            USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
            WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
            
        RAISE NOTICE 'Updated SUIS intelligence profiles policies';
    END IF;
END $$;

-- 2. Fix linguistics analysis foreign key ambiguity
DO $$
BEGIN
    -- Check for duplicate foreign key
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'call_analyses_linguistics_analysis_id_fkey'
        AND table_name = 'call_analysis'
    ) THEN
        ALTER TABLE call_analysis 
        DROP CONSTRAINT call_analyses_linguistics_analysis_id_fkey;
        RAISE NOTICE 'Dropped duplicate linguistics foreign key';
    END IF;
END $$;

-- 3. Create sales_activities table if missing
CREATE TABLE IF NOT EXISTS sales_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID,
    type VARCHAR(50) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    duration INTEGER,
    notes TEXT,
    outcome VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on sales_activities
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for sales_activities
DROP POLICY IF EXISTS "Users can view own activities" ON sales_activities;
CREATE POLICY "Users can manage own activities" ON sales_activities
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Grant permissions to authenticated users for all tables
GRANT ALL ON sales_activities TO authenticated;
GRANT ALL ON suis_intelligence_profiles TO authenticated;
GRANT ALL ON call_analysis TO authenticated;
GRANT ALL ON linguistics_analysis TO authenticated;

-- 5. Ensure all SUIS tables have proper RLS policies
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
            
            -- Grant permissions
            EXECUTE format('GRANT ALL ON %I TO authenticated', tbl);
            
            RAISE NOTICE 'Updated RLS for table: %', tbl;
        END IF;
    END LOOP;
END $$;

-- 6. Force schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Summary of fixes:
-- - Fixed SUIS profile RLS policies to be more permissive
-- - Removed duplicate foreign key constraint causing ambiguity
-- - Created sales_activities table if missing
-- - Granted proper permissions to authenticated users
-- - Ensured all SUIS tables have RLS enabled