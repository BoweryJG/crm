-- Safe version that checks for existing constraints
-- Create missing public tables for demo mode

-- 1. Create public_practices table if not exists
CREATE TABLE IF NOT EXISTS public_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  type TEXT CHECK (type IN ('dental', 'aesthetic', 'combined', 'other')),
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  patient_volume INTEGER,
  annual_revenue DECIMAL(12,2),
  procedures TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create public_call_analysis table if not exists
CREATE TABLE IF NOT EXISTS public_call_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID,
  user_id TEXT DEFAULT 'demo-user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sentiment_score DECIMAL(3,2),
  duration INTEGER,
  call_transcript TEXT,
  key_topics TEXT[],
  objections TEXT[],
  next_steps TEXT[],
  outcome TEXT,
  recording_url TEXT,
  linguistics_analysis_id UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create public_linguistics_analysis table if not exists
CREATE TABLE IF NOT EXISTS public_linguistics_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID,
  analysis_date TIMESTAMPTZ DEFAULT NOW(),
  sentiment_score DECIMAL(3,2),
  engagement_level DECIMAL(3,2),
  key_phrases TEXT[],
  emotional_indicators TEXT[],
  decision_language_detected BOOLEAN DEFAULT false,
  objection_patterns TEXT[],
  buying_signals INTEGER DEFAULT 0,
  risk_indicators INTEGER DEFAULT 0,
  summary TEXT,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create public_sales_activities table if not exists
CREATE TABLE IF NOT EXISTS public_sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo', 'follow_up', 'other')),
  contact_id UUID,
  practice_id UUID,
  user_id TEXT DEFAULT 'demo-user',
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER,
  notes TEXT,
  outcome TEXT CHECK (outcome IN ('successful', 'unsuccessful', 'follow_up_required', 'no_decision')),
  next_steps TEXT,
  associated_procedures TEXT[],
  associated_companies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create public_research_projects table if not exists
CREATE TABLE IF NOT EXISTS public_research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'archived')),
  category TEXT CHECK (category IN ('market_analysis', 'competitor_research', 'clinical_study', 'technology_assessment', 'regulatory', 'other')),
  start_date DATE,
  end_date DATE,
  user_id TEXT DEFAULT 'demo-user',
  tags TEXT[],
  key_findings TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create public_research_documents table if not exists
CREATE TABLE IF NOT EXISTS public_research_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public_research_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('report', 'analysis', 'presentation', 'data', 'other')),
  file_url TEXT,
  content TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create public_companies table if not exists
CREATE TABLE IF NOT EXISTS public_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT CHECK (industry IN ('dental', 'aesthetic', 'both', 'other')),
  founded_year INTEGER,
  headquarters TEXT,
  description TEXT,
  products TEXT[],
  procedures TEXT[],
  market_share DECIMAL(5,2),
  annual_revenue DECIMAL(12,2),
  key_contacts TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create public_procedures table if not exists
CREATE TABLE IF NOT EXISTS public_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('dental', 'aesthetic')),
  subcategory TEXT,
  description TEXT,
  average_cost DECIMAL(10,2),
  companies TEXT[],
  typical_duration INTEGER,
  recovery_time TEXT,
  popularity_score INTEGER CHECK (popularity_score >= 1 AND popularity_score <= 10),
  technical_complexity INTEGER CHECK (technical_complexity >= 1 AND technical_complexity <= 10),
  training_required TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints only if they don't exist
DO $$
BEGIN
  -- Add constraint for linguistics analysis if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_linguistics_analysis' 
    AND table_name = 'public_call_analysis'
  ) THEN
    ALTER TABLE public_call_analysis 
    ADD CONSTRAINT fk_linguistics_analysis 
    FOREIGN KEY (linguistics_analysis_id) 
    REFERENCES public_linguistics_analysis(id);
  END IF;

  -- Add constraint for call analysis if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_call_analysis' 
    AND table_name = 'public_linguistics_analysis'
  ) THEN
    ALTER TABLE public_linguistics_analysis 
    ADD CONSTRAINT fk_call_analysis 
    FOREIGN KEY (call_id) 
    REFERENCES public_call_analysis(id);
  END IF;
END $$;

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_public_call_analysis_contact_id ON public_call_analysis(contact_id);
CREATE INDEX IF NOT EXISTS idx_public_call_analysis_user_id ON public_call_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_public_call_analysis_created_at ON public_call_analysis(created_at);
CREATE INDEX IF NOT EXISTS idx_public_sales_activities_contact_id ON public_sales_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_public_sales_activities_practice_id ON public_sales_activities(practice_id);
CREATE INDEX IF NOT EXISTS idx_public_sales_activities_date ON public_sales_activities(date);
CREATE INDEX IF NOT EXISTS idx_public_research_projects_status ON public_research_projects(status);
CREATE INDEX IF NOT EXISTS idx_public_research_documents_project_id ON public_research_documents(project_id);

-- Enable RLS only if not already enabled
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'public_%'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- Create simple RLS policies if they don't exist
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'public_%'
  LOOP
    -- Drop existing policies to avoid conflicts
    EXECUTE format('DROP POLICY IF EXISTS "Enable read for all users" ON %I', t);
    -- Create new policy
    EXECUTE format('CREATE POLICY "Enable read for all users" ON %I FOR SELECT USING (true)', t);
  END LOOP;
END $$;

COMMENT ON TABLE public_practices IS 'Demo mode practices data';
COMMENT ON TABLE public_call_analysis IS 'Demo mode call analysis data';
COMMENT ON TABLE public_linguistics_analysis IS 'Demo mode linguistics analysis data';
COMMENT ON TABLE public_sales_activities IS 'Demo mode sales activities data';
COMMENT ON TABLE public_research_projects IS 'Demo mode research projects data';
COMMENT ON TABLE public_research_documents IS 'Demo mode research documents data';
COMMENT ON TABLE public_companies IS 'Demo mode companies data';
COMMENT ON TABLE public_procedures IS 'Demo mode procedures data';