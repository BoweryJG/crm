-- Create table for detailed interaction history
CREATE TABLE IF NOT EXISTS contact_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  interaction_type VARCHAR(50) NOT NULL, -- e.g., 'Emergency Call', 'Strategy Session', 'Review Meeting'
  duration VARCHAR(50),
  participants TEXT[], -- Array of participant names
  sentiment VARCHAR(50), -- e.g., 'Very Negative', 'Negative', 'Mixed', 'Positive', 'Very Positive'
  key_topics TEXT[], -- Array of topics discussed
  pain_points JSONB, -- Array of {issue, details, impact} objects
  relationship_red_flags TEXT[], -- Array of warning signs
  outcome TEXT NOT NULL,
  notes TEXT,
  metadata JSONB, -- Additional flexible data storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_contact_interactions_contact_id ON contact_interactions(contact_id);
CREATE INDEX idx_contact_interactions_user_id ON contact_interactions(user_id);
CREATE INDEX idx_contact_interactions_date ON contact_interactions(interaction_date DESC);
CREATE INDEX idx_contact_interactions_sentiment ON contact_interactions(sentiment);

-- Create table for at-risk accounts tracking
CREATE TABLE IF NOT EXISTS at_risk_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  monthly_value DECIMAL(12, 2),
  risk_factors JSONB NOT NULL, -- Array of {type, severity, description, impact} objects
  action_items JSONB NOT NULL, -- Array of {id, action, priority, deadline, completed} objects
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'resolved', 'monitoring'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for at-risk accounts
CREATE INDEX idx_at_risk_accounts_contact_id ON at_risk_accounts(contact_id);
CREATE INDEX idx_at_risk_accounts_user_id ON at_risk_accounts(user_id);
CREATE INDEX idx_at_risk_accounts_risk_score ON at_risk_accounts(risk_score DESC);
CREATE INDEX idx_at_risk_accounts_status ON at_risk_accounts(status);

-- Create a view for active at-risk accounts with contact details
CREATE OR REPLACE VIEW active_at_risk_accounts AS
SELECT 
  ara.*,
  c.first_name,
  c.last_name,
  c.phone,
  c.email,
  c.practice_id,
  p.name as practice_name,
  CONCAT(c.first_name, ' ', c.last_name) as full_name
FROM 
  at_risk_accounts ara
JOIN 
  contacts c ON ara.contact_id = c.id
LEFT JOIN 
  practices p ON c.practice_id = p.id
WHERE 
  ara.status = 'active'
ORDER BY 
  ara.risk_score DESC;

-- Add RLS policies for interaction history
ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contact interactions" ON contact_interactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contact interactions" ON contact_interactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact interactions" ON contact_interactions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contact interactions" ON contact_interactions
FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for at-risk accounts
ALTER TABLE at_risk_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own at-risk accounts" ON at_risk_accounts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own at-risk accounts" ON at_risk_accounts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own at-risk accounts" ON at_risk_accounts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own at-risk accounts" ON at_risk_accounts
FOR DELETE USING (auth.uid() = user_id);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_interactions_updated_at
BEFORE UPDATE ON contact_interactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_at_risk_accounts_updated_at
BEFORE UPDATE ON at_risk_accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add a function to calculate and update risk scores based on interactions
CREATE OR REPLACE FUNCTION calculate_contact_risk_score(p_contact_id UUID, p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_risk_score INTEGER := 0;
  v_recent_negative_count INTEGER;
  v_days_since_contact INTEGER;
  v_red_flags_count INTEGER;
BEGIN
  -- Count recent negative interactions
  SELECT COUNT(*) INTO v_recent_negative_count
  FROM contact_interactions
  WHERE contact_id = p_contact_id 
    AND user_id = p_user_id
    AND interaction_date >= NOW() - INTERVAL '30 days'
    AND sentiment IN ('Very Negative', 'Negative');
  
  -- Calculate days since last contact
  SELECT EXTRACT(DAY FROM NOW() - MAX(interaction_date))::INTEGER 
  INTO v_days_since_contact
  FROM contact_interactions
  WHERE contact_id = p_contact_id 
    AND user_id = p_user_id;
  
  -- Count total red flags
  SELECT COUNT(*) INTO v_red_flags_count
  FROM contact_interactions
  WHERE contact_id = p_contact_id 
    AND user_id = p_user_id
    AND interaction_date >= NOW() - INTERVAL '90 days'
    AND jsonb_array_length(to_jsonb(relationship_red_flags)) > 0;
  
  -- Calculate risk score
  v_risk_score := LEAST(100, 
    (v_recent_negative_count * 20) + 
    (CASE 
      WHEN v_days_since_contact > 30 THEN 20
      WHEN v_days_since_contact > 14 THEN 10
      ELSE 0
    END) +
    (v_red_flags_count * 15)
  );
  
  RETURN v_risk_score;
END;
$$ LANGUAGE plpgsql;

-- Add comment documentation
COMMENT ON TABLE contact_interactions IS 'Stores detailed interaction history for contacts including call transcripts, meetings, and other touchpoints';
COMMENT ON TABLE at_risk_accounts IS 'Tracks accounts at risk with scoring, action items, and recovery plans';
COMMENT ON FUNCTION calculate_contact_risk_score IS 'Calculates risk score for a contact based on recent interactions, sentiment, and engagement patterns';