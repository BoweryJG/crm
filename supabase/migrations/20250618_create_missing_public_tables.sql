-- Create Missing Public Tables for Demo Mode
-- This migration creates all missing public_ tables needed for a fully functional demo

-- 1. Create public_practices table
CREATE TABLE IF NOT EXISTS public_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  type TEXT NOT NULL CHECK (type IN ('dental', 'aesthetic', 'combined', 'other')),
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  patient_volume INTEGER,
  annual_revenue NUMERIC,
  procedures TEXT[],
  technologies TEXT[],
  specialties TEXT[],
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'lead')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create public_call_analysis table
CREATE TABLE IF NOT EXISTS public_call_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  call_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  contact_id UUID REFERENCES public_contacts(id) ON DELETE SET NULL,
  practice_id UUID REFERENCES public_practices(id) ON DELETE SET NULL,
  recording_url TEXT,
  transcript TEXT,
  summary TEXT,
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  linguistics_analysis_id UUID,
  key_topics TEXT[],
  buying_signals TEXT[],
  objections TEXT[],
  action_items TEXT[],
  next_steps TEXT[],
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create public_linguistics_analysis table
CREATE TABLE IF NOT EXISTS public_linguistics_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID REFERENCES public_call_analysis(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sentiment_score DECIMAL(3,2) NOT NULL,
  confidence_scores JSONB,
  key_phrases TEXT[],
  speech_patterns JSONB,
  interruption_analysis JSONB,
  pace_analysis JSONB,
  tone_analysis JSONB,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update foreign key reference in public_call_analysis
ALTER TABLE public_call_analysis 
  ADD CONSTRAINT fk_linguistics_analysis 
  FOREIGN KEY (linguistics_analysis_id) 
  REFERENCES public_linguistics_analysis(id) ON DELETE SET NULL;

-- 4. Create public_sales_activities table
CREATE TABLE IF NOT EXISTS public_sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  contact_id UUID REFERENCES public_contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task')),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in minutes
  notes TEXT,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create public_research_projects table
CREATE TABLE IF NOT EXISTS public_research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  tags TEXT[],
  priority INTEGER CHECK (priority >= 1 AND priority <= 5),
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create public_research_documents table
CREATE TABLE IF NOT EXISTS public_research_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public_research_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('report', 'analysis', 'summary', 'notes', 'presentation')),
  created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  is_ai_generated BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create public_companies table
CREATE TABLE IF NOT EXISTS public_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT NOT NULL,
  industry TEXT NOT NULL CHECK (industry IN ('dental', 'aesthetic', 'both', 'other')),
  founded_year INTEGER,
  headquarters TEXT NOT NULL,
  description TEXT NOT NULL,
  products TEXT[] NOT NULL,
  procedures TEXT[],
  market_share NUMERIC,
  annual_revenue NUMERIC,
  key_contacts TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create public_procedures table
CREATE TABLE IF NOT EXISTS public_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dental', 'aesthetic')),
  subcategory TEXT NOT NULL,
  description TEXT NOT NULL,
  avg_cost_min NUMERIC,
  avg_cost_max NUMERIC,
  avg_duration INTEGER, -- in minutes
  recovery_time TEXT,
  popularity_score INTEGER CHECK (popularity_score >= 1 AND popularity_score <= 10),
  key_benefits TEXT[],
  ideal_candidates TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_public_practices_type ON public_practices(type);
CREATE INDEX idx_public_practices_city_state ON public_practices(city, state);
CREATE INDEX idx_public_call_analysis_contact_id ON public_call_analysis(contact_id);
CREATE INDEX idx_public_call_analysis_call_date ON public_call_analysis(call_date);
CREATE INDEX idx_public_linguistics_call_id ON public_linguistics_analysis(call_id);
CREATE INDEX idx_public_sales_activities_contact_id ON public_sales_activities(contact_id);
CREATE INDEX idx_public_sales_activities_date ON public_sales_activities(date);
CREATE INDEX idx_public_research_documents_project_id ON public_research_documents(project_id);
CREATE INDEX idx_public_companies_industry ON public_companies(industry);
CREATE INDEX idx_public_procedures_category ON public_procedures(category);

-- Enable RLS but allow all users to read
ALTER TABLE public_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_call_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_linguistics_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_procedures ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for all public tables
CREATE POLICY "Allow all users to read public_practices"
  ON public_practices FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_call_analysis"
  ON public_call_analysis FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_linguistics_analysis"
  ON public_linguistics_analysis FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_sales_activities"
  ON public_sales_activities FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_research_projects"
  ON public_research_projects FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_research_documents"
  ON public_research_documents FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_companies"
  ON public_companies FOR SELECT USING (true);

CREATE POLICY "Allow all users to read public_procedures"
  ON public_procedures FOR SELECT USING (true);