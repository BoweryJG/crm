-- Fix missing columns in existing tables

-- Add user_id column to tables that might be missing it
DO $$
BEGIN
  -- Add user_id to public_call_analysis if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_call_analysis' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public_call_analysis ADD COLUMN user_id TEXT DEFAULT 'demo-user';
  END IF;

  -- Add user_id to public_sales_activities if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_sales_activities' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public_sales_activities ADD COLUMN user_id TEXT DEFAULT 'demo-user';
  END IF;

  -- Add user_id to public_research_projects if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'public_research_projects' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public_research_projects ADD COLUMN user_id TEXT DEFAULT 'demo-user';
  END IF;
END $$;

-- Check which tables exist and their structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name LIKE 'public_%'
ORDER BY table_name, ordinal_position;