-- RepSpheres Multi-tenant Calling Platform Database Schema
-- This migration creates all necessary tables for the calling platform with Row Level Security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rep Profiles table - Core rep information
CREATE TABLE IF NOT EXISTS public.rep_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    territory VARCHAR(255),
    preferred_area_code VARCHAR(3),
    industry VARCHAR(100),
    phone_number VARCHAR(20),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Rep Twilio Configuration - Phone numbers and webhook config
CREATE TABLE IF NOT EXISTS public.rep_twilio_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    twilio_sid VARCHAR(100) NOT NULL,
    twilio_app_sid VARCHAR(100) NOT NULL,
    webhook_config JSONB NOT NULL DEFAULT '{}',
    provisioned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rep_id),
    UNIQUE(phone_number),
    UNIQUE(twilio_sid)
);

-- Rep Dashboard Configuration - Personalized dashboard settings
CREATE TABLE IF NOT EXISTS public.rep_dashboard_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    layout VARCHAR(50) DEFAULT 'luxury-standard',
    theme VARCHAR(50) DEFAULT 'corporate-professional',
    widgets JSONB NOT NULL DEFAULT '{}',
    preferences JSONB NOT NULL DEFAULT '{}',
    personalization JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rep_id)
);

-- Call Records - Individual call data with transcription
CREATE TABLE IF NOT EXISTS public.rep_call_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    call_sid VARCHAR(100) NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    from_number VARCHAR(20) NOT NULL,
    to_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled')),
    duration_seconds INTEGER DEFAULT 0,
    recording_url TEXT,
    transcription_text TEXT,
    transcription_confidence DECIMAL(3,2),
    ai_analysis JSONB DEFAULT '{}',
    sentiment_score DECIMAL(3,2),
    keywords JSONB DEFAULT '[]',
    call_quality_score DECIMAL(3,2),
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(call_sid)
);

-- Rep Analytics - Aggregated performance metrics
CREATE TABLE IF NOT EXISTS public.rep_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    daily_stats JSONB NOT NULL DEFAULT '{}',
    weekly_insights JSONB NOT NULL DEFAULT '{}',
    coaching_notes JSONB NOT NULL DEFAULT '{}',
    performance_metrics JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rep_id, date)
);

-- Rep AI Models - Custom AI configuration per rep
CREATE TABLE IF NOT EXISTS public.rep_ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    custom_vocabulary JSONB NOT NULL DEFAULT '{}',
    industry_terms JSONB NOT NULL DEFAULT '[]',
    success_patterns JSONB NOT NULL DEFAULT '{}',
    model_version VARCHAR(20) DEFAULT '1.0',
    training_data_count INTEGER DEFAULT 0,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rep_id)
);

-- Rep Tasks - Onboarding and ongoing tasks
CREATE TABLE IF NOT EXISTS public.rep_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('tutorial', 'onboarding', 'follow-up', 'coaching', 'admin')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rep Notifications - In-app notifications
CREATE TABLE IF NOT EXISTS public.rep_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_text VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Transcription Segments - Detailed transcription data
CREATE TABLE IF NOT EXISTS public.call_transcription_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID REFERENCES public.rep_call_records(id) ON DELETE CASCADE,
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    speaker VARCHAR(20) NOT NULL CHECK (speaker IN ('rep', 'customer', 'unknown')),
    text TEXT NOT NULL,
    confidence DECIMAL(3,2),
    start_time DECIMAL(8,2),
    end_time DECIMAL(8,2),
    sentiment VARCHAR(20),
    keywords JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rep Coaching Sessions - AI-powered coaching data
CREATE TABLE IF NOT EXISTS public.rep_coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('auto-analysis', 'manual-review', 'peer-coaching', 'manager-review')),
    call_ids JSONB NOT NULL DEFAULT '[]',
    strengths JSONB NOT NULL DEFAULT '[]',
    improvement_areas JSONB NOT NULL DEFAULT '[]',
    action_items JSONB NOT NULL DEFAULT '[]',
    overall_score DECIMAL(3,2),
    coach_notes TEXT,
    rep_feedback TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rep_profiles_user_id ON public.rep_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_rep_profiles_email ON public.rep_profiles(email);
CREATE INDEX IF NOT EXISTS idx_rep_twilio_config_rep_id ON public.rep_twilio_config(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_twilio_config_phone ON public.rep_twilio_config(phone_number);
CREATE INDEX IF NOT EXISTS idx_rep_call_records_rep_id ON public.rep_call_records(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_call_records_contact_id ON public.rep_call_records(contact_id);
CREATE INDEX IF NOT EXISTS idx_rep_call_records_call_sid ON public.rep_call_records(call_sid);
CREATE INDEX IF NOT EXISTS idx_rep_call_records_started_at ON public.rep_call_records(started_at);
CREATE INDEX IF NOT EXISTS idx_rep_analytics_rep_id_date ON public.rep_analytics(rep_id, date);
CREATE INDEX IF NOT EXISTS idx_rep_tasks_rep_id ON public.rep_tasks(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_tasks_completed ON public.rep_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_rep_notifications_rep_id ON public.rep_notifications(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_notifications_read ON public.rep_notifications(read);
CREATE INDEX IF NOT EXISTS idx_call_transcription_call_id ON public.call_transcription_segments(call_id);
CREATE INDEX IF NOT EXISTS idx_call_transcription_rep_id ON public.call_transcription_segments(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_coaching_rep_id ON public.rep_coaching_sessions(rep_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.rep_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_twilio_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_dashboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_call_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_transcription_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_coaching_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rep_profiles
CREATE POLICY "rep_profiles_select_own" ON public.rep_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "rep_profiles_insert_own" ON public.rep_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "rep_profiles_update_own" ON public.rep_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for rep_twilio_config
CREATE POLICY "rep_twilio_config_select_own" ON public.rep_twilio_config
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_twilio_config_insert_own" ON public.rep_twilio_config
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_twilio_config_update_own" ON public.rep_twilio_config
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_dashboard_config
CREATE POLICY "rep_dashboard_config_select_own" ON public.rep_dashboard_config
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_dashboard_config_insert_own" ON public.rep_dashboard_config
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_dashboard_config_update_own" ON public.rep_dashboard_config
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_call_records
CREATE POLICY "rep_call_records_select_own" ON public.rep_call_records
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_call_records_insert_own" ON public.rep_call_records
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_call_records_update_own" ON public.rep_call_records
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_analytics
CREATE POLICY "rep_analytics_select_own" ON public.rep_analytics
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_analytics_insert_own" ON public.rep_analytics
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_analytics_update_own" ON public.rep_analytics
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_ai_models
CREATE POLICY "rep_ai_models_select_own" ON public.rep_ai_models
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_ai_models_insert_own" ON public.rep_ai_models
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_ai_models_update_own" ON public.rep_ai_models
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_tasks
CREATE POLICY "rep_tasks_select_own" ON public.rep_tasks
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_tasks_insert_own" ON public.rep_tasks
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_tasks_update_own" ON public.rep_tasks
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_notifications
CREATE POLICY "rep_notifications_select_own" ON public.rep_notifications
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_notifications_insert_own" ON public.rep_notifications
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_notifications_update_own" ON public.rep_notifications
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for call_transcription_segments
CREATE POLICY "call_transcription_segments_select_own" ON public.call_transcription_segments
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "call_transcription_segments_insert_own" ON public.call_transcription_segments
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- RLS Policies for rep_coaching_sessions
CREATE POLICY "rep_coaching_sessions_select_own" ON public.rep_coaching_sessions
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_coaching_sessions_insert_own" ON public.rep_coaching_sessions
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "rep_coaching_sessions_update_own" ON public.rep_coaching_sessions
    FOR UPDATE USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update timestamp triggers
CREATE TRIGGER update_rep_profiles_updated_at BEFORE UPDATE ON public.rep_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_twilio_config_updated_at BEFORE UPDATE ON public.rep_twilio_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_dashboard_config_updated_at BEFORE UPDATE ON public.rep_dashboard_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_call_records_updated_at BEFORE UPDATE ON public.rep_call_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_analytics_updated_at BEFORE UPDATE ON public.rep_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_ai_models_updated_at BEFORE UPDATE ON public.rep_ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_tasks_updated_at BEFORE UPDATE ON public.rep_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rep_coaching_sessions_updated_at BEFORE UPDATE ON public.rep_coaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for rep dashboard summary
CREATE OR REPLACE VIEW public.rep_dashboard_summary AS
SELECT 
    rp.id as rep_id,
    rp.full_name,
    rp.email,
    rtc.phone_number,
    rtc.status as calling_status,
    COUNT(rcr.id) as total_calls,
    COUNT(CASE WHEN rcr.status = 'completed' THEN 1 END) as completed_calls,
    COALESCE(AVG(rcr.duration_seconds), 0) as avg_call_duration,
    COUNT(CASE WHEN DATE(rcr.started_at) = CURRENT_DATE THEN 1 END) as calls_today,
    COUNT(CASE WHEN DATE(rcr.started_at) >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as calls_this_week
FROM public.rep_profiles rp
LEFT JOIN public.rep_twilio_config rtc ON rp.id = rtc.rep_id
LEFT JOIN public.rep_call_records rcr ON rp.id = rcr.rep_id
GROUP BY rp.id, rp.full_name, rp.email, rtc.phone_number, rtc.status;

-- Grant permissions for the dashboard view
GRANT SELECT ON public.rep_dashboard_summary TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "rep_dashboard_summary_select_own" ON public.rep_dashboard_summary
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- Billing Receipts table - Track all billing receipts sent to reps
CREATE TABLE IF NOT EXISTS public.billing_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES public.rep_profiles(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) NOT NULL,
    receipt_type VARCHAR(50) NOT NULL CHECK (receipt_type IN ('calling_platform_activation', 'subscription_change', 'renewal', 'cancellation')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period VARCHAR(20) CHECK (billing_period IN ('monthly', 'annual')),
    plan_type VARCHAR(50),
    service_details JSONB DEFAULT '{}',
    email_sent BOOLEAN DEFAULT FALSE,
    email_message_id VARCHAR(255),
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(transaction_id)
);

-- Create index for billing receipts
CREATE INDEX IF NOT EXISTS idx_billing_receipts_rep_id ON public.billing_receipts(rep_id);
CREATE INDEX IF NOT EXISTS idx_billing_receipts_transaction_id ON public.billing_receipts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_billing_receipts_created_at ON public.billing_receipts(created_at);

-- Enable RLS on billing receipts
ALTER TABLE public.billing_receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for billing_receipts
CREATE POLICY "billing_receipts_select_own" ON public.billing_receipts
    FOR SELECT USING (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "billing_receipts_insert_own" ON public.billing_receipts
    FOR INSERT WITH CHECK (
        rep_id IN (SELECT id FROM public.rep_profiles WHERE user_id = auth.uid())
    );

-- Add trigger for email sent timestamp
CREATE OR REPLACE FUNCTION update_email_sent_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_sent = TRUE AND OLD.email_sent = FALSE THEN
        NEW.email_sent_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_billing_receipts_email_sent_at BEFORE UPDATE ON public.billing_receipts FOR EACH ROW EXECUTE FUNCTION update_email_sent_timestamp();

-- Add comments for documentation
COMMENT ON TABLE public.rep_profiles IS 'Core rep profile information and settings';
COMMENT ON TABLE public.rep_twilio_config IS 'Twilio phone number and webhook configuration per rep';
COMMENT ON TABLE public.rep_dashboard_config IS 'Personalized dashboard layout and preferences';
COMMENT ON TABLE public.rep_call_records IS 'Individual call records with transcription and analysis';
COMMENT ON TABLE public.rep_analytics IS 'Aggregated performance metrics and insights';
COMMENT ON TABLE public.rep_ai_models IS 'Custom AI models and vocabulary per rep';
COMMENT ON TABLE public.rep_tasks IS 'Onboarding tasks and ongoing action items';
COMMENT ON TABLE public.rep_notifications IS 'In-app notifications and alerts';
COMMENT ON TABLE public.call_transcription_segments IS 'Detailed call transcription with speaker identification';
COMMENT ON TABLE public.rep_coaching_sessions IS 'AI-powered coaching sessions and feedback';
COMMENT ON TABLE public.billing_receipts IS 'Automated billing receipts sent to reps for calling platform services';