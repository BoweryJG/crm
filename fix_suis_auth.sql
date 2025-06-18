-- Fix SUIS authentication and RLS issues
-- This script updates the RLS policies to properly handle authenticated users

-- First, let's check if the tables exist and have the correct RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own intelligence profile" ON suis_intelligence_profiles;
DROP POLICY IF EXISTS "Users can view relevant market intelligence" ON suis_market_intelligence;

-- Create more permissive policies for suis_intelligence_profiles
-- Allow users to select their own profile
CREATE POLICY "Users can view own profile" ON suis_intelligence_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can create own profile" ON suis_intelligence_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON suis_intelligence_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON suis_intelligence_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Update market intelligence policy to be more permissive
CREATE POLICY "Users can view relevant market intelligence" ON suis_market_intelligence
    FOR SELECT USING (
        is_active = TRUE AND
        (
            territory_id IS NULL OR 
            territory_id = ANY(
                SELECT unnest(territory_ids) 
                FROM suis_intelligence_profiles 
                WHERE user_id = auth.uid()
            ) OR
            -- Allow viewing if user has no profile yet
            NOT EXISTS (
                SELECT 1 
                FROM suis_intelligence_profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Grant necessary permissions
GRANT ALL ON suis_intelligence_profiles TO authenticated;
GRANT ALL ON suis_market_intelligence TO authenticated;
GRANT ALL ON suis_market_trends TO authenticated;
GRANT ALL ON suis_unified_analytics TO authenticated;
GRANT ALL ON suis_performance_scores TO authenticated;
GRANT ALL ON suis_contact_universe TO authenticated;
GRANT ALL ON suis_contact_engagements TO authenticated;
GRANT ALL ON suis_research_queries TO authenticated;
GRANT ALL ON suis_knowledge_base TO authenticated;
GRANT ALL ON suis_generated_content TO authenticated;
GRANT ALL ON suis_content_performance TO authenticated;
GRANT ALL ON suis_call_intelligence TO authenticated;
GRANT ALL ON suis_call_analytics TO authenticated;
GRANT ALL ON suis_notifications TO authenticated;
GRANT ALL ON suis_notification_rules TO authenticated;
GRANT ALL ON suis_learning_paths TO authenticated;
GRANT ALL ON suis_learning_progress TO authenticated;

-- Also grant usage on sequences if they exist
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;