-- Fix production issues identified from console logs

-- 1. Fix SUIS profileType column issue
-- The error shows "Could not find the 'profileType' column" - this is a camelCase vs snake_case issue
-- The table has 'profile_type' but the code is trying to insert 'profileType'

-- 2. Fix linguistics_analysis relationship ambiguity
-- The error shows multiple relationships exist between call_analysis and linguistics_analysis
-- We need to specify which foreign key to use

-- First, let's check and fix the column name issue
DO $$
BEGIN
    -- Check if profile_type column exists (it should based on the schema)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'suis_intelligence_profiles' 
        AND column_name = 'profile_type'
    ) THEN
        RAISE NOTICE 'Column profile_type exists correctly';
    ELSE
        RAISE NOTICE 'ERROR: profile_type column is missing!';
    END IF;
END $$;

-- Fix the linguistics analysis relationship by dropping the duplicate foreign key
-- The error suggests there are two relationships:
-- 1. call_analyses_linguistics_analysis_id_fkey
-- 2. call_analysis_linguistics_analysis_id_fkey

DO $$
BEGIN
    -- Drop the duplicate foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'call_analyses_linguistics_analysis_id_fkey'
        AND table_name = 'call_analysis'
    ) THEN
        ALTER TABLE call_analysis 
        DROP CONSTRAINT call_analyses_linguistics_analysis_id_fkey;
        RAISE NOTICE 'Dropped duplicate foreign key constraint';
    END IF;
END $$;

-- Ensure sales_activities table exists and has proper structure
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
CREATE POLICY "Users can view own activities" ON sales_activities
    FOR SELECT USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON sales_activities TO authenticated;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';