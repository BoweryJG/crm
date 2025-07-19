-- Create rep_email_accounts table for multi-email sending
CREATE TABLE IF NOT EXISTS rep_email_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rep_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  display_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('personal', 'work', 'other')),
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'smtp')),
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  oauth_tokens JSONB,
  smtp_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on email per rep
CREATE UNIQUE INDEX IF NOT EXISTS rep_email_accounts_unique_email_per_rep 
ON rep_email_accounts (rep_id, email_address);

-- Create index for quick lookup by rep_id
CREATE INDEX IF NOT EXISTS rep_email_accounts_rep_id_idx 
ON rep_email_accounts (rep_id);

-- Create index for primary account lookup
CREATE INDEX IF NOT EXISTS rep_email_accounts_primary_idx 
ON rep_email_accounts (rep_id, is_primary) WHERE is_primary = TRUE;

-- Enable Row Level Security
ALTER TABLE rep_email_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Reps can only see their own email accounts
CREATE POLICY "rep_email_accounts_select_policy" ON rep_email_accounts FOR SELECT
USING (rep_id = auth.uid());

-- Policy: Reps can only insert their own email accounts
CREATE POLICY "rep_email_accounts_insert_policy" ON rep_email_accounts FOR INSERT
WITH CHECK (rep_id = auth.uid());

-- Policy: Reps can only update their own email accounts
CREATE POLICY "rep_email_accounts_update_policy" ON rep_email_accounts FOR UPDATE
USING (rep_id = auth.uid());

-- Policy: Reps can only delete their own email accounts
CREATE POLICY "rep_email_accounts_delete_policy" ON rep_email_accounts FOR DELETE
USING (rep_id = auth.uid());

-- Create email_send_logs table for tracking
CREATE TABLE IF NOT EXISTS email_send_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rep_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_account_id UUID NOT NULL REFERENCES rep_email_accounts(id) ON DELETE CASCADE,
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

-- Enable RLS on logs
ALTER TABLE email_send_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Reps can only see their own send logs
CREATE POLICY "email_send_logs_select_policy" ON email_send_logs FOR SELECT
USING (rep_id = auth.uid());

-- Policy: Reps can only insert their own send logs
CREATE POLICY "email_send_logs_insert_policy" ON email_send_logs FOR INSERT
WITH CHECK (rep_id = auth.uid());

-- Create indexes for email_send_logs
CREATE INDEX IF NOT EXISTS email_send_logs_rep_id_idx ON email_send_logs (rep_id);
CREATE INDEX IF NOT EXISTS email_send_logs_from_account_idx ON email_send_logs (from_account_id);
CREATE INDEX IF NOT EXISTS email_send_logs_sent_at_idx ON email_send_logs (sent_at DESC);
CREATE INDEX IF NOT EXISTS email_send_logs_status_idx ON email_send_logs (status);

-- Function to ensure only one primary account per rep
CREATE OR REPLACE FUNCTION ensure_single_primary_email_account()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this account as primary
    IF NEW.is_primary = TRUE THEN
        -- Remove primary from all other accounts for this rep
        UPDATE rep_email_accounts 
        SET is_primary = FALSE 
        WHERE rep_id = NEW.rep_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single primary account
DROP TRIGGER IF EXISTS ensure_single_primary_email_account_trigger ON rep_email_accounts;
CREATE TRIGGER ensure_single_primary_email_account_trigger
    BEFORE INSERT OR UPDATE ON rep_email_accounts
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_email_account();

-- Function to automatically set first account as primary
CREATE OR REPLACE FUNCTION set_first_account_as_primary()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is the first account for this rep, make it primary
    IF NOT EXISTS (SELECT 1 FROM rep_email_accounts WHERE rep_id = NEW.rep_id AND id != NEW.id) THEN
        NEW.is_primary = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set first account as primary
DROP TRIGGER IF EXISTS set_first_account_as_primary_trigger ON rep_email_accounts;
CREATE TRIGGER set_first_account_as_primary_trigger
    BEFORE INSERT ON rep_email_accounts
    FOR EACH ROW
    EXECUTE FUNCTION set_first_account_as_primary();

-- Insert sample data for existing users (optional)
-- This would be done during migration for existing reps

COMMENT ON TABLE rep_email_accounts IS 'Stores multiple email accounts per rep for multi-email sending';
COMMENT ON TABLE email_send_logs IS 'Tracks all email sends for analytics and debugging';
COMMENT ON COLUMN rep_email_accounts.oauth_tokens IS 'Encrypted OAuth tokens for Gmail/Outlook';
COMMENT ON COLUMN rep_email_accounts.smtp_config IS 'Encrypted SMTP configuration for custom email servers';