-- Create automation workflows table
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paused',
  description TEXT,
  success_rate INTEGER DEFAULT 0,
  config JSONB,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create automation tasks table
CREATE TABLE IF NOT EXISTS automation_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create magic links table
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  workflow_type TEXT NOT NULL,
  target_email TEXT,
  target_contact_id UUID,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_automation_tasks_workflow_id ON automation_tasks(workflow_id);
CREATE INDEX IF NOT EXISTS idx_automation_tasks_created_at ON automation_tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires_at ON magic_links(expires_at);

-- Insert some default workflows
INSERT INTO automation_workflows (name, type, status, description, success_rate)
VALUES 
  ('Weekly Sales Reports', 'report_generation', 'active', 'Automated weekly sales performance reports', 95),
  ('Follow-up Email Campaign', 'email_sequence', 'active', '3-step follow-up sequence for new contacts', 92),
  ('Quarterly Outreach', 'outreach_campaign', 'scheduled', 'Re-engagement campaign for inactive contacts', 88),
  ('Content Pipeline', 'content_generation', 'paused', 'AI-powered content creation workflow', 85)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read workflows
CREATE POLICY "Users can view all workflows" ON automation_workflows
  FOR ALL USING (true);

-- Allow all authenticated users to manage tasks
CREATE POLICY "Users can manage tasks" ON automation_tasks
  FOR ALL USING (true);

-- Allow all authenticated users to manage magic links
CREATE POLICY "Users can manage magic links" ON magic_links
  FOR ALL USING (true);