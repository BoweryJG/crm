-- Compliance and Intelligence System Tables
-- FDA compliance, medical claims validation, competitive intelligence, and audit trails

-- Compliance checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  check_results JSONB NOT NULL DEFAULT '[]',
  overall_status VARCHAR(20) NOT NULL CHECK (overall_status IN ('compliant', 'warnings', 'violations')),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_by UUID REFERENCES auth.users(id) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliant templates
CREATE TABLE IF NOT EXISTS compliant_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  body TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  compliance_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical claims table
CREATE TABLE IF NOT EXISTS medical_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_text TEXT NOT NULL,
  claim_type VARCHAR(50) NOT NULL CHECK (claim_type IN ('efficacy', 'safety', 'comparative', 'economic', 'quality_of_life')),
  product_name VARCHAR(255) NOT NULL,
  substantiation_required BOOLEAN DEFAULT true,
  substantiation_status VARCHAR(20) DEFAULT 'pending' CHECK (substantiation_status IN ('pending', 'approved', 'rejected', 'conditional')),
  evidence_documents JSONB DEFAULT '[]',
  review_notes TEXT,
  validation_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Evidence documents for claims
CREATE TABLE IF NOT EXISTS evidence_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES medical_claims(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('clinical_study', 'fda_clearance', 'peer_review', 'internal_data', 'expert_opinion')),
  title VARCHAR(500) NOT NULL,
  source VARCHAR(500) NOT NULL,
  publication_date DATE,
  relevance_score DECIMAL(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  key_findings TEXT[],
  limitations TEXT[],
  document_url TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Compliance approvals workflow
CREATE TABLE IF NOT EXISTS compliance_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT,
  compliance_check_id UUID REFERENCES compliance_checks(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL UNIQUE,
  market_share DECIMAL(5,2),
  strengths TEXT[],
  weaknesses TEXT[],
  monitoring_keywords TEXT[],
  threat_level VARCHAR(20) CHECK (threat_level IN ('high', 'medium', 'low')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor products
CREATE TABLE IF NOT EXISTS competitor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  fda_clearance VARCHAR(100),
  key_features TEXT[],
  pricing_info JSONB,
  market_position TEXT,
  customer_feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor activities monitoring
CREATE TABLE IF NOT EXISTS competitor_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('product_launch', 'pricing_change', 'marketing_campaign', 'clinical_study', 'partnership', 'regulatory_update')),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  impact_assessment JSONB,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(255),
  response_required BOOLEAN DEFAULT false,
  response_strategy JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitive battlecards
CREATE TABLE IF NOT EXISTS competitive_battlecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  our_product VARCHAR(255) NOT NULL,
  their_product VARCHAR(255) NOT NULL,
  key_differentiators JSONB NOT NULL DEFAULT '[]',
  win_strategies JSONB NOT NULL DEFAULT '[]',
  objection_handlers JSONB NOT NULL DEFAULT '[]',
  proof_points JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market intelligence
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_segment VARCHAR(255) NOT NULL,
  total_market_size DECIMAL(15,2),
  growth_rate DECIMAL(5,2),
  key_trends JSONB DEFAULT '[]',
  opportunities JSONB DEFAULT '[]',
  threats JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice patterns for predictive timing
CREATE TABLE IF NOT EXISTS practice_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  practice_type VARCHAR(50),
  typical_schedule JSONB NOT NULL DEFAULT '{}',
  busy_periods JSONB DEFAULT '[]',
  communication_preferences JSONB DEFAULT '[]',
  seasonal_variations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagement history for timing predictions
CREATE TABLE IF NOT EXISTS engagement_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES practices(id),
  interaction_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  hour_of_day INTEGER NOT NULL CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  response_time INTEGER, -- in minutes
  engagement_score DECIMAL(3,1) DEFAULT 0,
  outcome VARCHAR(20) CHECK (outcome IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timing models for ML predictions
CREATE TABLE IF NOT EXISTS timing_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id VARCHAR(100) UNIQUE NOT NULL,
  model_type VARCHAR(50) CHECK (model_type IN ('individual', 'practice', 'specialty', 'global')),
  features JSONB NOT NULL DEFAULT '[]',
  accuracy_score DECIMAL(3,2),
  last_trained TIMESTAMPTZ,
  training_samples INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comprehensive audit trail
CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_role VARCHAR(50),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  changes JSONB,
  metadata JSONB,
  compliance_relevant BOOLEAN DEFAULT false,
  retention_years INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail archive for old records
CREATE TABLE IF NOT EXISTS audit_trail_archive (
  LIKE audit_trail INCLUDING ALL
);

-- Audit anomalies detection
CREATE TABLE IF NOT EXISTS audit_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_event_id UUID REFERENCES audit_trail(id),
  user_id UUID REFERENCES auth.users(id),
  anomaly_types TEXT[],
  severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

-- Audit reports
CREATE TABLE IF NOT EXISTS audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) CHECK (report_type IN ('compliance', 'user_activity', 'data_access', 'security')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  generated_by UUID REFERENCES auth.users(id) NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  summary JSONB NOT NULL,
  details JSONB NOT NULL,
  export_format VARCHAR(10),
  file_url TEXT
);

-- Compliance audit logs (simplified version for compliance engine)
CREATE TABLE IF NOT EXISTS compliance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255) NOT NULL,
  content_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  compliance_status VARCHAR(50),
  details JSONB,
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_compliance_checks_user ON compliance_checks(checked_by);
CREATE INDEX idx_compliance_checks_status ON compliance_checks(overall_status);
CREATE INDEX idx_compliance_checks_date ON compliance_checks(checked_at);

CREATE INDEX idx_medical_claims_product ON medical_claims(product_name);
CREATE INDEX idx_medical_claims_status ON medical_claims(substantiation_status);
CREATE INDEX idx_medical_claims_type ON medical_claims(claim_type);

CREATE INDEX idx_competitor_activities_competitor ON competitor_activities(competitor_id);
CREATE INDEX idx_competitor_activities_type ON competitor_activities(activity_type);
CREATE INDEX idx_competitor_activities_date ON competitor_activities(detected_at);

CREATE INDEX idx_engagement_history_contact ON engagement_history(contact_id);
CREATE INDEX idx_engagement_history_practice ON engagement_history(practice_id);
CREATE INDEX idx_engagement_history_timestamp ON engagement_history(timestamp);
CREATE INDEX idx_engagement_history_day_hour ON engagement_history(day_of_week, hour_of_day);

CREATE INDEX idx_audit_trail_user ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_timestamp ON audit_trail(timestamp);
CREATE INDEX idx_audit_trail_event_type ON audit_trail(event_type);
CREATE INDEX idx_audit_trail_compliance ON audit_trail(compliance_relevant) WHERE compliance_relevant = true;

-- Enable Row Level Security
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliant_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitive_battlecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE timing_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - adjust based on your auth structure)
-- Allow authenticated users to read compliance checks
CREATE POLICY "Users can read compliance checks" ON compliance_checks
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create compliance checks
CREATE POLICY "Users can create compliance checks" ON compliance_checks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow compliance officers to manage templates
CREATE POLICY "Compliance officers can manage templates" ON compliant_templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'compliance_officer' OR auth.jwt() ->> 'role' = 'admin');

-- Allow users to read approved templates
CREATE POLICY "Users can read approved templates" ON compliant_templates
  FOR SELECT USING (approved = true AND auth.role() = 'authenticated');

-- Similar policies for other tables...
-- Add more specific policies based on your auth and role structure

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_compliant_templates_updated_at BEFORE UPDATE ON compliant_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_products_updated_at BEFORE UPDATE ON competitor_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitive_battlecards_updated_at BEFORE UPDATE ON competitive_battlecards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_intelligence_updated_at BEFORE UPDATE ON market_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_patterns_updated_at BEFORE UPDATE ON practice_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timing_models_updated_at BEFORE UPDATE ON timing_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_trail_updated_at BEFORE UPDATE ON audit_trail
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();