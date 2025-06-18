-- ROLLBACK SCRIPT - Run this on the WRONG project where you accidentally ran the script

-- 1. Remove SUIS tables if they were created
DROP TABLE IF EXISTS suis_learning_progress CASCADE;
DROP TABLE IF EXISTS suis_learning_paths CASCADE;
DROP TABLE IF EXISTS suis_notification_rules CASCADE;
DROP TABLE IF EXISTS suis_notifications CASCADE;
DROP TABLE IF EXISTS suis_call_analytics CASCADE;
DROP TABLE IF EXISTS suis_call_intelligence CASCADE;
DROP TABLE IF EXISTS suis_content_performance CASCADE;
DROP TABLE IF EXISTS suis_generated_content CASCADE;
DROP TABLE IF EXISTS suis_knowledge_base CASCADE;
DROP TABLE IF EXISTS suis_research_queries CASCADE;
DROP TABLE IF EXISTS suis_contact_engagements CASCADE;
DROP TABLE IF EXISTS suis_contact_universe CASCADE;
DROP TABLE IF EXISTS suis_performance_scores CASCADE;
DROP TABLE IF EXISTS suis_unified_analytics CASCADE;
DROP TABLE IF EXISTS suis_market_trends CASCADE;
DROP TABLE IF EXISTS suis_market_intelligence CASCADE;
DROP TABLE IF EXISTS suis_intelligence_profiles CASCADE;

-- 2. Remove sales_activities table if it was created by our script
-- BE CAREFUL: Only drop this if you're sure it was created by our script
-- and doesn't contain important data
-- DROP TABLE IF EXISTS sales_activities CASCADE;

-- 3. If the script only modified policies, here's how to check what policies exist:
-- List all policies to review
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename LIKE 'suis_%' 
   OR tablename = 'sales_activities'
   OR tablename = 'call_analysis'
   OR tablename = 'linguistics_analysis'
ORDER BY tablename, policyname;

-- 4. Remove any policies that were created
-- Example (uncomment and modify as needed):
-- DROP POLICY IF EXISTS "Authenticated users can manage their profile" ON suis_intelligence_profiles;
-- DROP POLICY IF EXISTS "Users can manage own activities" ON sales_activities;

-- Note: Foreign key constraints that were dropped cannot be easily restored
-- You may need to check your original schema to recreate them if needed