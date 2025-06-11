-- SPHEREOS UNIFIED INTELLIGENCE SYSTEM (SUIS)
-- Complete Database Schema Implementation
-- Version: 1.0.0
-- Date: 2025-01-06

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ==================================================================
-- CORE INTELLIGENCE PROFILES
-- ==================================================================

-- Core Intelligence Profiles - User preferences and goals
CREATE TABLE suis_intelligence_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_type VARCHAR(50) NOT NULL CHECK (profile_type IN ('rep', 'manager', 'executive')),
    specializations TEXT[] DEFAULT '{}',
    territory_ids UUID[] DEFAULT '{}',
    goals JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    ai_settings JSONB DEFAULT '{
        "notification_frequency": "real_time",
        "insight_depth": "detailed",
        "automation_level": "assisted"
    }',
    performance_baseline JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_specializations CHECK (
        specializations <@ ARRAY['aesthetics', 'dental', 'surgical', 'dermatology', 'orthopedics']
    )
);

-- ==================================================================
-- MARKET INTELLIGENCE SYSTEM
-- ==================================================================

-- Market Intelligence Data Repository
CREATE TABLE suis_market_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL CHECK (source IN ('sphere1a', 'market_feed', 'competitor', 'news', 'regulatory')),
    intelligence_type VARCHAR(50) NOT NULL,
    specialty VARCHAR(50),
    territory_id UUID,
    geographic_scope VARCHAR(100), -- 'local', 'regional', 'national', 'global'
    data JSONB NOT NULL,
    raw_data JSONB, -- Original unprocessed data
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    relevance_scores JSONB DEFAULT '{}', -- Per-user/segment relevance
    tags TEXT[] DEFAULT '{}',
    impact_assessment JSONB DEFAULT '{}',
    trend_direction VARCHAR(20) CHECK (trend_direction IN ('up', 'down', 'stable', 'volatile')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Market Trends Analysis
CREATE TABLE suis_market_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intelligence_id UUID REFERENCES suis_market_intelligence(id) ON DELETE CASCADE,
    trend_category VARCHAR(50) NOT NULL,
    trend_name VARCHAR(200) NOT NULL,
    trend_description TEXT,
    time_period DATERANGE NOT NULL,
    growth_rate DECIMAL(5,2),
    volume_data JSONB,
    price_trends JSONB,
    competitive_landscape JSONB,
    prediction_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- UNIFIED ANALYTICS ENGINE
-- ==================================================================

-- Unified Analytics - Comprehensive performance metrics
CREATE TABLE suis_unified_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analytics_type VARCHAR(50) NOT NULL CHECK (
        analytics_type IN ('rep_performance', 'region_metrics', 'procedure_analytics', 'market_share', 'competitive_analysis')
    ),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    metrics JSONB NOT NULL,
    insights JSONB DEFAULT '[]',
    benchmarks JSONB DEFAULT '{}',
    predictions JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    data_sources TEXT[] DEFAULT '{}',
    calculation_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (period_end >= period_start)
);

-- Performance Scoring System
CREATE TABLE suis_performance_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score_type VARCHAR(50) NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    component_scores JSONB NOT NULL,
    percentile_rank DECIMAL(5,2),
    trend_direction VARCHAR(20),
    improvement_areas JSONB DEFAULT '[]',
    strengths JSONB DEFAULT '[]',
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ
);

-- ==================================================================
-- CONTACT UNIVERSE SYSTEM
-- ==================================================================

-- Contact Universe - Tiered contact management
CREATE TABLE suis_contact_universe (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_tier VARCHAR(20) NOT NULL CHECK (contact_tier IN ('tier_20', 'tier_50', 'tier_100')),
    contact_data JSONB NOT NULL,
    practice_information JSONB DEFAULT '{}',
    procedure_interests TEXT[] DEFAULT '{}',
    acquisition_source VARCHAR(100),
    enrichment_data JSONB DEFAULT '{}',
    quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
    engagement_score DECIMAL(3,2) CHECK (engagement_score >= 0 AND engagement_score <= 1),
    conversion_probability DECIMAL(3,2),
    engagement_history JSONB DEFAULT '[]',
    communication_preferences JSONB DEFAULT '{}',
    last_interaction TIMESTAMPTZ,
    next_recommended_action JSONB,
    lifecycle_stage VARCHAR(50) DEFAULT 'prospect',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Engagement Tracking
CREATE TABLE suis_contact_engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES suis_contact_universe(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    engagement_type VARCHAR(50) NOT NULL,
    engagement_channel VARCHAR(50),
    engagement_data JSONB NOT NULL,
    outcome VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- RESEARCH MODULE ENHANCEMENT
-- ==================================================================

-- Research Queries - OpenRouter integration
CREATE TABLE suis_research_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    query_context JSONB DEFAULT '{}',
    search_parameters JSONB DEFAULT '{}',
    openrouter_model VARCHAR(100),
    model_parameters JSONB DEFAULT '{}',
    response_data JSONB,
    sources_cited JSONB DEFAULT '[]',
    relevance_to_goals JSONB DEFAULT '{}',
    accuracy_rating DECIMAL(3,2),
    user_feedback JSONB,
    processing_time_ms INTEGER,
    token_usage JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base Integration
CREATE TABLE suis_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    confidence_score DECIMAL(3,2),
    source_url TEXT,
    last_verified TIMESTAMPTZ,
    embedding_vector VECTOR(1536), -- For semantic search
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- CONTENT GENERATION SYSTEM
-- ==================================================================

-- Generated Content - AI-powered content creation
CREATE TABLE suis_generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (
        content_type IN ('email', 'presentation', 'social', 'proposal', 'follow_up', 'newsletter')
    ),
    target_audience JSONB NOT NULL,
    procedure_focus VARCHAR(100),
    content_data JSONB NOT NULL,
    generation_parameters JSONB DEFAULT '{}',
    ai_model_used VARCHAR(100),
    personalization_level VARCHAR(20) DEFAULT 'medium',
    performance_metrics JSONB DEFAULT '{}',
    a_b_test_data JSONB,
    version INTEGER DEFAULT 1,
    parent_content_id UUID REFERENCES suis_generated_content(id),
    approval_status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Performance Tracking
CREATE TABLE suis_content_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES suis_generated_content(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,4),
    measurement_date DATE NOT NULL,
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- CALL INTELLIGENCE SYSTEM
-- ==================================================================

-- Call Intelligence - Twilio integration
CREATE TABLE suis_call_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    twilio_call_sid VARCHAR(255) UNIQUE,
    contact_id UUID REFERENCES suis_contact_universe(id),
    call_metadata JSONB NOT NULL,
    call_duration INTEGER, -- seconds
    call_outcome VARCHAR(50),
    transcription TEXT,
    transcription_confidence DECIMAL(3,2),
    sentiment_analysis JSONB DEFAULT '{}',
    emotion_analysis JSONB DEFAULT '{}',
    key_topics TEXT[] DEFAULT '{}',
    objections_raised JSONB DEFAULT '[]',
    commitments_made JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    coaching_insights JSONB DEFAULT '[]',
    compliance_flags JSONB DEFAULT '[]',
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_scheduled TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Call Analytics Aggregation
CREATE TABLE suis_call_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_calls INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- seconds
    success_rate DECIMAL(5,2),
    average_sentiment DECIMAL(3,2),
    common_objections JSONB DEFAULT '[]',
    improvement_areas JSONB DEFAULT '[]',
    performance_trends JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- INTELLIGENT NOTIFICATIONS SYSTEM
-- ==================================================================

-- Notifications - Smart notification system
CREATE TABLE suis_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (
        notification_type IN ('insight', 'alert', 'recommendation', 'update', 'achievement')
    ),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    category VARCHAR(50),
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    context_data JSONB DEFAULT '{}',
    prediction_data JSONB,
    action_required BOOLEAN DEFAULT FALSE,
    action_items JSONB DEFAULT '[]',
    action_taken JSONB,
    delivery_method VARCHAR(50) DEFAULT 'in_app',
    scheduled_delivery TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Rules Engine
CREATE TABLE suis_notification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rule_name VARCHAR(200) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    frequency_limit JSONB DEFAULT '{}', -- Rate limiting
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- LEARNING CENTER ENHANCEMENT
-- ==================================================================

-- Learning Paths - AI-powered learning system
CREATE TABLE suis_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    path_type VARCHAR(50) NOT NULL CHECK (
        path_type IN ('skill_gap', 'product_mastery', 'market_knowledge', 'sales_technique', 'compliance')
    ),
    path_name VARCHAR(200) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    estimated_duration INTEGER, -- minutes
    prerequisites TEXT[] DEFAULT '{}',
    learning_objectives JSONB DEFAULT '[]',
    current_progress JSONB DEFAULT '{}',
    recommended_resources JSONB DEFAULT '[]',
    performance_correlation JSONB DEFAULT '{}',
    adaptive_parameters JSONB DEFAULT '{}',
    completion_criteria JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Progress Tracking
CREATE TABLE suis_learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID REFERENCES suis_learning_paths(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id VARCHAR(100) NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- minutes
    assessment_scores JSONB DEFAULT '{}',
    competency_level VARCHAR(20),
    last_accessed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- SYSTEM CONFIGURATION & METADATA
-- ==================================================================

-- System Configuration
CREATE TABLE suis_system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Processing Queue
CREATE TABLE suis_processing_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    retry_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==================================================================

-- Intelligence Profiles
CREATE INDEX idx_intelligence_profiles_user ON suis_intelligence_profiles(user_id);
CREATE INDEX idx_intelligence_profiles_type ON suis_intelligence_profiles(profile_type);

-- Market Intelligence
CREATE INDEX idx_market_intel_source_type ON suis_market_intelligence(source, intelligence_type);
CREATE INDEX idx_market_intel_territory ON suis_market_intelligence(territory_id);
CREATE INDEX idx_market_intel_specialty ON suis_market_intelligence(specialty);
CREATE INDEX idx_market_intel_created ON suis_market_intelligence(created_at DESC);
CREATE INDEX idx_market_intel_active ON suis_market_intelligence(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_market_intel_tags ON suis_market_intelligence USING GIN(tags);

-- Unified Analytics
CREATE INDEX idx_unified_analytics_user_period ON suis_unified_analytics(user_id, period_start, period_end);
CREATE INDEX idx_unified_analytics_type ON suis_unified_analytics(analytics_type);

-- Contact Universe
CREATE INDEX idx_contact_universe_user_tier ON suis_contact_universe(user_id, contact_tier);
CREATE INDEX idx_contact_universe_quality ON suis_contact_universe(quality_score DESC);
CREATE INDEX idx_contact_universe_engagement ON suis_contact_universe(engagement_score DESC);
CREATE INDEX idx_contact_universe_lifecycle ON suis_contact_universe(lifecycle_stage);

-- Research Queries
CREATE INDEX idx_research_queries_user ON suis_research_queries(user_id);
CREATE INDEX idx_research_queries_created ON suis_research_queries(created_at DESC);

-- Content Generation
CREATE INDEX idx_generated_content_user_type ON suis_generated_content(user_id, content_type);
CREATE INDEX idx_generated_content_status ON suis_generated_content(approval_status);

-- Call Intelligence
CREATE INDEX idx_call_intelligence_user ON suis_call_intelligence(user_id);
CREATE INDEX idx_call_intelligence_twilio ON suis_call_intelligence(twilio_call_sid);
CREATE INDEX idx_call_intelligence_contact ON suis_call_intelligence(contact_id);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON suis_notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_priority ON suis_notifications(priority, created_at DESC);
CREATE INDEX idx_notifications_delivery ON suis_notifications(scheduled_delivery) WHERE delivered_at IS NULL;

-- Learning Paths
CREATE INDEX idx_learning_paths_user_type ON suis_learning_paths(user_id, path_type);
CREATE INDEX idx_learning_progress_path ON suis_learning_progress(learning_path_id);

-- Processing Queue
CREATE INDEX idx_processing_queue_status ON suis_processing_queue(status, scheduled_for);
CREATE INDEX idx_processing_queue_type ON suis_processing_queue(queue_type);

-- ==================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================================

-- Enable RLS on all tables
ALTER TABLE suis_intelligence_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_unified_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_contact_universe ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_contact_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_research_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_call_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_call_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE suis_learning_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own intelligence profile" ON suis_intelligence_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view relevant market intelligence" ON suis_market_intelligence
    FOR SELECT USING (
        is_active = TRUE AND
        (territory_id IS NULL OR territory_id = ANY(
            SELECT unnest(territory_ids) FROM suis_intelligence_profiles WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can view own analytics" ON suis_unified_analytics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own performance scores" ON suis_performance_scores
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own contacts" ON suis_contact_universe
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own contact engagements" ON suis_contact_engagements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own research" ON suis_research_queries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Knowledge base is publicly readable" ON suis_knowledge_base
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own content" ON suis_generated_content
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own call intelligence" ON suis_call_intelligence
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own call analytics" ON suis_call_analytics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON suis_notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notification rules" ON suis_notification_rules
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning paths" ON suis_learning_paths
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning progress" ON suis_learning_progress
    FOR ALL USING (auth.uid() = user_id);

-- ==================================================================
-- HELPER FUNCTIONS AND TRIGGERS
-- ==================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_intelligence_profiles_updated_at 
    BEFORE UPDATE ON suis_intelligence_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_intelligence_updated_at 
    BEFORE UPDATE ON suis_market_intelligence 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unified_analytics_updated_at 
    BEFORE UPDATE ON suis_unified_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_universe_updated_at 
    BEFORE UPDATE ON suis_contact_universe 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at 
    BEFORE UPDATE ON suis_generated_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at 
    BEFORE UPDATE ON suis_learning_paths 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at 
    BEFORE UPDATE ON suis_learning_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_rules_updated_at 
    BEFORE UPDATE ON suis_notification_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analytics calculation function
CREATE OR REPLACE FUNCTION calculate_rep_intelligence(
    p_user_id UUID,
    p_period_start DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_period_end DATE DEFAULT CURRENT_DATE
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_call_metrics JSONB;
    v_content_metrics JSONB;
    v_engagement_metrics JSONB;
BEGIN
    -- Calculate call metrics
    SELECT jsonb_build_object(
        'total_calls', COUNT(*),
        'average_duration', AVG(call_duration),
        'success_rate', AVG(CASE WHEN call_outcome = 'success' THEN 1.0 ELSE 0.0 END),
        'sentiment_score', AVG((sentiment_analysis->>'overall')::decimal)
    ) INTO v_call_metrics
    FROM suis_call_intelligence
    WHERE user_id = p_user_id 
    AND created_at::date BETWEEN p_period_start AND p_period_end;

    -- Calculate content performance
    SELECT jsonb_build_object(
        'content_created', COUNT(*),
        'avg_performance', AVG((performance_metrics->>'engagement_rate')::decimal)
    ) INTO v_content_metrics
    FROM suis_generated_content
    WHERE user_id = p_user_id 
    AND created_at::date BETWEEN p_period_start AND p_period_end;

    -- Calculate engagement metrics
    SELECT jsonb_build_object(
        'contacts_engaged', COUNT(DISTINCT contact_id),
        'avg_engagement_score', AVG(engagement_score),
        'conversion_rate', AVG(conversion_probability)
    ) INTO v_engagement_metrics
    FROM suis_contact_universe
    WHERE user_id = p_user_id 
    AND updated_at::date BETWEEN p_period_start AND p_period_end;

    -- Combine all metrics
    v_result := jsonb_build_object(
        'call_intelligence', COALESCE(v_call_metrics, '{}'::jsonb),
        'content_performance', COALESCE(v_content_metrics, '{}'::jsonb),
        'engagement_metrics', COALESCE(v_engagement_metrics, '{}'::jsonb),
        'calculated_at', NOW(),
        'period', jsonb_build_object('start', p_period_start, 'end', p_period_end)
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Contact scoring function
CREATE OR REPLACE FUNCTION calculate_contact_quality_score(
    p_contact_data JSONB,
    p_practice_info JSONB DEFAULT '{}'::jsonb,
    p_engagement_history JSONB DEFAULT '[]'::jsonb
) RETURNS DECIMAL AS $$
DECLARE
    v_score DECIMAL DEFAULT 0.0;
    v_completeness_score DECIMAL;
    v_practice_score DECIMAL;
    v_engagement_score DECIMAL;
BEGIN
    -- Data completeness score (0-0.4)
    v_completeness_score := (
        CASE WHEN p_contact_data->>'email' IS NOT NULL THEN 0.1 ELSE 0 END +
        CASE WHEN p_contact_data->>'phone' IS NOT NULL THEN 0.1 ELSE 0 END +
        CASE WHEN p_contact_data->>'title' IS NOT NULL THEN 0.1 ELSE 0 END +
        CASE WHEN p_contact_data->>'company' IS NOT NULL THEN 0.1 ELSE 0 END
    );

    -- Practice information score (0-0.3)
    v_practice_score := (
        CASE WHEN p_practice_info->>'practice_size' IS NOT NULL THEN 0.1 ELSE 0 END +
        CASE WHEN p_practice_info->>'procedures_performed' IS NOT NULL THEN 0.1 ELSE 0 END +
        CASE WHEN p_practice_info->>'annual_volume' IS NOT NULL THEN 0.1 ELSE 0 END
    );

    -- Engagement history score (0-0.3)
    v_engagement_score := LEAST(0.3, jsonb_array_length(p_engagement_history) * 0.05);

    v_score := v_completeness_score + v_practice_score + v_engagement_score;

    RETURN LEAST(1.0, v_score);
END;
$$ LANGUAGE plpgsql;

-- Insert initial system configuration
INSERT INTO suis_system_config (config_key, config_value, config_type, description) VALUES
('openrouter_models', '["openai/gpt-4", "anthropic/claude-3-opus", "meta-llama/llama-3-70b-instruct"]', 'array', 'Available OpenRouter models for research queries'),
('notification_batch_size', '50', 'integer', 'Maximum notifications to process in one batch'),
('market_intelligence_refresh_interval', '300', 'integer', 'Market intelligence refresh interval in seconds'),
('call_analysis_confidence_threshold', '0.8', 'decimal', 'Minimum confidence score for call analysis results'),
('content_generation_rate_limit', '10', 'integer', 'Maximum content generations per user per hour');

-- Create initial notification rules for system events
INSERT INTO suis_notification_rules (user_id, rule_name, rule_type, conditions, actions) 
SELECT 
    id,
    'High Value Opportunity Alert',
    'opportunity_detection',
    '{"min_value": 10000, "probability_threshold": 0.7}',
    '{"create_notification": true, "priority": "high", "send_email": false}'
FROM auth.users
WHERE email LIKE '%@sphereos.com';

COMMIT;