-- Create rep_work_email_accounts table for direct SMTP sending (no OAuth needed)
CREATE TABLE IF NOT EXISTS rep_work_email_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rep_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  display_name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'yahoo', 'icloud', 'office365', 'other')),
  smtp_config JSONB NOT NULL, -- Encrypted SMTP credentials
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on email per rep
CREATE UNIQUE INDEX IF NOT EXISTS rep_work_email_accounts_unique_email_per_rep 
ON rep_work_email_accounts (rep_id, email_address);

-- Create index for quick lookup by rep_id
CREATE INDEX IF NOT EXISTS rep_work_email_accounts_rep_id_idx 
ON rep_work_email_accounts (rep_id);

-- Create index for primary account lookup
CREATE INDEX IF NOT EXISTS rep_work_email_accounts_primary_idx 
ON rep_work_email_accounts (rep_id, is_primary) WHERE is_primary = TRUE;

-- Enable Row Level Security
ALTER TABLE rep_work_email_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Reps can only see their own work email accounts
CREATE POLICY "rep_work_email_accounts_select_policy" ON rep_work_email_accounts FOR SELECT
USING (rep_id = auth.uid());

-- Policy: Reps can only insert their own work email accounts
CREATE POLICY "rep_work_email_accounts_insert_policy" ON rep_work_email_accounts FOR INSERT
WITH CHECK (rep_id = auth.uid());

-- Policy: Reps can only update their own work email accounts
CREATE POLICY "rep_work_email_accounts_update_policy" ON rep_work_email_accounts FOR UPDATE
USING (rep_id = auth.uid());

-- Policy: Reps can only delete their own work email accounts
CREATE POLICY "rep_work_email_accounts_delete_policy" ON rep_work_email_accounts FOR DELETE
USING (rep_id = auth.uid());

-- Create direct_email_send_logs table for tracking SMTP sends
CREATE TABLE IF NOT EXISTS direct_email_send_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rep_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_account_id UUID NOT NULL REFERENCES rep_work_email_accounts(id) ON DELETE CASCADE,
  from_email TEXT NOT NULL,
  to_addresses TEXT[] NOT NULL,
  cc_addresses TEXT[],
  bcc_addresses TEXT[],
  subject TEXT NOT NULL,
  body_preview TEXT, -- First 200 chars for logging
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Analytics fields
  automation_id UUID, -- If sent from automation
  campaign_id UUID,   -- If part of campaign
  contact_id UUID,    -- Primary recipient contact
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on direct email logs
ALTER TABLE direct_email_send_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Reps can only see their own send logs
CREATE POLICY "direct_email_send_logs_select_policy" ON direct_email_send_logs FOR SELECT
USING (rep_id = auth.uid());

-- Policy: Reps can only insert their own send logs
CREATE POLICY "direct_email_send_logs_insert_policy" ON direct_email_send_logs FOR INSERT
WITH CHECK (rep_id = auth.uid());

-- Create indexes for direct_email_send_logs
CREATE INDEX IF NOT EXISTS direct_email_send_logs_rep_id_idx ON direct_email_send_logs (rep_id);
CREATE INDEX IF NOT EXISTS direct_email_send_logs_from_account_idx ON direct_email_send_logs (from_account_id);
CREATE INDEX IF NOT EXISTS direct_email_send_logs_sent_at_idx ON direct_email_send_logs (sent_at DESC);
CREATE INDEX IF NOT EXISTS direct_email_send_logs_status_idx ON direct_email_send_logs (status);

-- Function to ensure only one primary work email account per rep
CREATE OR REPLACE FUNCTION ensure_single_primary_work_email_account()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this account as primary
    IF NEW.is_primary = TRUE THEN
        -- Remove primary from all other accounts for this rep
        UPDATE rep_work_email_accounts 
        SET is_primary = FALSE 
        WHERE rep_id = NEW.rep_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single primary account
DROP TRIGGER IF EXISTS ensure_single_primary_work_email_account_trigger ON rep_work_email_accounts;
CREATE TRIGGER ensure_single_primary_work_email_account_trigger
    BEFORE INSERT OR UPDATE ON rep_work_email_accounts
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_work_email_account();

-- Function to automatically set first work email account as primary
CREATE OR REPLACE FUNCTION set_first_work_email_account_as_primary()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is the first work email account for this rep, make it primary
    IF NOT EXISTS (SELECT 1 FROM rep_work_email_accounts WHERE rep_id = NEW.rep_id AND id != NEW.id) THEN
        NEW.is_primary = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set first work email account as primary
DROP TRIGGER IF EXISTS set_first_work_email_account_as_primary_trigger ON rep_work_email_accounts;
CREATE TRIGGER set_first_work_email_account_as_primary_trigger
    BEFORE INSERT ON rep_work_email_accounts
    FOR EACH ROW
    EXECUTE FUNCTION set_first_work_email_account_as_primary();

-- Create table for storing email provider configurations (for quick setup)
CREATE TABLE IF NOT EXISTS email_provider_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_secure BOOLEAN NOT NULL,
  imap_host TEXT,
  imap_port INTEGER,
  imap_secure BOOLEAN,
  oauth_available BOOLEAN DEFAULT FALSE,
  app_password_required BOOLEAN DEFAULT FALSE,
  setup_instructions JSONB,
  common_domains TEXT[], -- Common email domains for auto-detection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common email provider configurations
INSERT INTO email_provider_configs (
  provider_name, display_name, smtp_host, smtp_port, smtp_secure, 
  imap_host, imap_port, imap_secure, app_password_required, common_domains,
  setup_instructions
) VALUES 
  (
    'gmail', 'Gmail / Google Workspace', 'smtp.gmail.com', 587, false,
    'imap.gmail.com', 993, true, true, ARRAY['gmail.com'],
    '{"steps": ["Enable 2-Step Verification", "Generate App Password", "Use App Password instead of regular password"], "notes": ["App Passwords bypass IT restrictions", "Works with Google Workspace accounts"]}'
  ),
  (
    'outlook', 'Outlook / Hotmail', 'smtp-mail.outlook.com', 587, false,
    'outlook.office365.com', 993, true, false, ARRAY['outlook.com', 'hotmail.com', 'live.com'],
    '{"steps": ["Use your regular email password", "Enable IMAP if needed"], "notes": ["Most Outlook accounts work directly", "No special setup required"]}'
  ),
  (
    'office365', 'Office 365 Corporate', 'smtp.office365.com', 587, false,
    'outlook.office365.com', 993, true, false, ARRAY['onmicrosoft.com'],
    '{"steps": ["Check if SMTP Auth is enabled", "Use your corporate credentials", "May require App Password"], "notes": ["Corporate accounts may have restrictions", "Check with IT if connection fails"]}'
  ),
  (
    'yahoo', 'Yahoo Mail', 'smtp.mail.yahoo.com', 587, false,
    'imap.mail.yahoo.com', 993, true, true, ARRAY['yahoo.com'],
    '{"steps": ["Enable 2-Step Verification", "Generate App Password", "Use App Password for authentication"], "notes": ["App Password required for SMTP access"]}'
  ),
  (
    'icloud', 'iCloud Mail', 'smtp.mail.me.com', 587, false,
    'imap.mail.me.com', 993, true, true, ARRAY['icloud.com', 'me.com'],
    '{"steps": ["Enable 2-Factor Authentication", "Generate App-Specific Password", "Use App Password for RepSpheres"], "notes": ["App-specific passwords required for third-party apps"]}'
  );

-- Comments for documentation
COMMENT ON TABLE rep_work_email_accounts IS 'Stores work email accounts with direct SMTP credentials (no OAuth required)';
COMMENT ON TABLE direct_email_send_logs IS 'Tracks all direct SMTP email sends for analytics and debugging';
COMMENT ON TABLE email_provider_configs IS 'Pre-configured email provider settings for easy setup';
COMMENT ON COLUMN rep_work_email_accounts.smtp_config IS 'Encrypted SMTP credentials including email, password, host, port, security settings';
COMMENT ON COLUMN email_provider_configs.setup_instructions IS 'JSON object containing setup steps and notes for the provider';