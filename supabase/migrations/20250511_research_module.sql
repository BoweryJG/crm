-- RepSpheres CRM - Research Module Tables
-- This migration adds the necessary tables for the research module,
-- including research projects, documents, and AI-generated content.

-- Research Project Status Enum
CREATE TYPE research_project_status AS ENUM (
  'active',
  'completed',
  'archived',
  'on_hold'
);

-- Research Document Type Enum
CREATE TYPE research_document_type AS ENUM (
  'market_analysis',
  'competitor_profile',
  'practice_profile',
  'trend_analysis',
  'technology_assessment',
  'literature_review',
  'survey_results',
  'interview_notes',
  'other'
);

-- Research Projects Table
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status research_project_status NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID[] DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  related_practices UUID[] DEFAULT '{}',
  related_contacts UUID[] DEFAULT '{}',
  priority INTEGER DEFAULT 3, -- 1 (highest) to 5 (lowest)
  progress INTEGER DEFAULT 0, -- 0 to 100 percent
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Research Documents Table
CREATE TABLE research_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES research_projects(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type research_document_type NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  ai_prompt_id UUID,
  version INTEGER NOT NULL DEFAULT 1,
  parent_document_id UUID REFERENCES research_documents(id),
  tags TEXT[] DEFAULT '{}',
  related_practices UUID[] DEFAULT '{}',
  related_contacts UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Research Tasks Table
CREATE TABLE research_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES research_projects(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 3, -- 1 (highest) to 5 (lowest)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Research Prompts Table (specialized AI prompts for research)
CREATE TABLE research_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_name TEXT NOT NULL,
  prompt_content TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  model_used TEXT NOT NULL,
  parameter_defaults JSONB DEFAULT '{}'::JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  usage_count INTEGER NOT NULL DEFAULT 0,
  effectiveness_score DECIMAL(3,1),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Research Notes Table (quick notes related to research)
CREATE TABLE research_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES research_projects(id),
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  related_practices UUID[] DEFAULT '{}',
  related_contacts UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Research Data Queries Table (saved queries for market research data)
CREATE TABLE research_data_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  query_type TEXT NOT NULL,
  query_parameters JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_data_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read research_projects"
  ON research_projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create research_projects"
  ON research_projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own research_projects"
  ON research_projects
  FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = ANY(assigned_to));

CREATE POLICY "Authenticated users can read research_documents"
  ON research_documents
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create research_documents"
  ON research_documents
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own research_documents"
  ON research_documents
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can read research_tasks"
  ON research_tasks
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create research_tasks"
  ON research_tasks
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their assigned research_tasks"
  ON research_tasks
  FOR UPDATE
  USING (auth.uid() = assigned_to);

CREATE POLICY "Authenticated users can read research_prompts"
  ON research_prompts
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create research_prompts"
  ON research_prompts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own research_prompts"
  ON research_prompts
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can read research_notes"
  ON research_notes
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create research_notes"
  ON research_notes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own research_notes"
  ON research_notes
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can read research_data_queries"
  ON research_data_queries
  FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_public OR auth.uid() = created_by));

CREATE POLICY "Users can create research_data_queries"
  ON research_data_queries
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own research_data_queries"
  ON research_data_queries
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Create indexes for faster searching
CREATE INDEX idx_research_projects_created_by ON research_projects (created_by);
CREATE INDEX idx_research_projects_status ON research_projects (status);
CREATE INDEX idx_research_documents_project_id ON research_documents (project_id);
CREATE INDEX idx_research_documents_document_type ON research_documents (document_type);
CREATE INDEX idx_research_tasks_project_id ON research_tasks (project_id);
CREATE INDEX idx_research_tasks_assigned_to ON research_tasks (assigned_to);
CREATE INDEX idx_research_notes_project_id ON research_notes (project_id);

-- Add triggers to update timestamps
CREATE TRIGGER update_research_projects_timestamp
BEFORE UPDATE ON research_projects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_research_documents_timestamp
BEFORE UPDATE ON research_documents
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_research_tasks_timestamp
BEFORE UPDATE ON research_tasks
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_research_prompts_timestamp
BEFORE UPDATE ON research_prompts
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_research_notes_timestamp
BEFORE UPDATE ON research_notes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_research_data_queries_timestamp
BEFORE UPDATE ON research_data_queries
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
