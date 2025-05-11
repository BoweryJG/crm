-- RepSpheres CRM - Research Module Automation Extension
-- This migration adds automation-related fields to the research_documents table

-- Add automation-related fields to research_documents table
ALTER TABLE research_documents
ADD COLUMN contact_id UUID REFERENCES contacts(id),
ADD COLUMN practice_id UUID REFERENCES practices(id),
ADD COLUMN automation_workflow_id UUID,
ADD COLUMN automation_status TEXT DEFAULT 'not_started',
ADD COLUMN automation_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN automation_completed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for faster searching
CREATE INDEX idx_research_documents_contact_id ON research_documents (contact_id);
CREATE INDEX idx_research_documents_practice_id ON research_documents (practice_id);
CREATE INDEX idx_research_documents_automation_status ON research_documents (automation_status);

-- Update RLS policies to include automation fields
CREATE POLICY "Users can update automation fields on research_documents"
  ON research_documents
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
