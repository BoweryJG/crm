-- Dashboard Metrics Tables for Supabase

-- Main dashboard metrics table
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    total_contacts INTEGER DEFAULT 0,
    contacts_change DECIMAL(5,2) DEFAULT 0,
    active_practices INTEGER DEFAULT 0,
    practices_change DECIMAL(5,2) DEFAULT 0,
    revenue_generated BIGINT DEFAULT 0, -- in cents to avoid decimal issues
    revenue_change DECIMAL(5,2) DEFAULT 0,
    active_campaigns INTEGER DEFAULT 0,
    campaigns_change DECIMAL(5,2) DEFAULT 0,
    sales_goal BIGINT DEFAULT 1300000, -- $1.3M in cents
    current_revenue BIGINT DEFAULT 0, -- in cents
    sales_goal_progress INTEGER DEFAULT 0, -- percentage
    quota_percentage INTEGER DEFAULT 0, -- percentage (synced with sales_goal_progress)
    pipeline_value BIGINT DEFAULT 0, -- in cents
    conversion_rate INTEGER DEFAULT 0, -- percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Add constraint to ensure one record per user
    CONSTRAINT unique_user_metrics UNIQUE(user_id)
);

-- Revenue goals table for quarterly/annual tracking
CREATE TABLE IF NOT EXISTS revenue_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    goal_amount BIGINT NOT NULL, -- in cents
    current_amount BIGINT DEFAULT 0, -- in cents
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Add constraint to prevent overlapping periods for same user
    CONSTRAINT unique_user_period UNIQUE(user_id, period_start)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_user_id ON dashboard_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_goals_user_id ON revenue_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_goals_period ON revenue_goals(user_id, period_start, period_end);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_dashboard_metrics_updated_at 
    BEFORE UPDATE ON dashboard_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_goals_updated_at 
    BEFORE UPDATE ON revenue_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demo user
INSERT INTO dashboard_metrics (
    user_id,
    total_contacts,
    contacts_change,
    active_practices,
    practices_change,
    revenue_generated,
    revenue_change,
    active_campaigns,
    campaigns_change,
    sales_goal,
    current_revenue,
    sales_goal_progress,
    quota_percentage,
    pipeline_value,
    conversion_rate
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- demo user ID
    1341,
    9.2,
    358,
    11.3,
    93200000, -- $932K in cents
    2.9,
    26,
    23,
    130000000, -- $1.3M in cents
    88400000, -- $884K in cents  
    68, -- 68% progress
    68, -- 68% quota (synced)
    139800000, -- $1.398M pipeline in cents
    45 -- 45% conversion
) ON CONFLICT (user_id) DO UPDATE SET
    total_contacts = EXCLUDED.total_contacts,
    contacts_change = EXCLUDED.contacts_change,
    active_practices = EXCLUDED.active_practices,
    practices_change = EXCLUDED.practices_change,
    revenue_generated = EXCLUDED.revenue_generated,
    revenue_change = EXCLUDED.revenue_change,
    active_campaigns = EXCLUDED.active_campaigns,
    campaigns_change = EXCLUDED.campaigns_change,
    sales_goal = EXCLUDED.sales_goal,
    current_revenue = EXCLUDED.current_revenue,
    sales_goal_progress = EXCLUDED.sales_goal_progress,
    quota_percentage = EXCLUDED.quota_percentage,
    pipeline_value = EXCLUDED.pipeline_value,
    conversion_rate = EXCLUDED.conversion_rate,
    updated_at = timezone('utc'::text, now());

-- Insert sample revenue goal for demo user
INSERT INTO revenue_goals (
    user_id,
    goal_amount,
    current_amount,
    period_start,
    period_end
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- demo user ID
    130000000, -- $1.3M in cents
    88400000, -- $884K current in cents
    '2025-01-01T00:00:00Z',
    '2025-12-31T23:59:59Z'
) ON CONFLICT (user_id, period_start) DO UPDATE SET
    goal_amount = EXCLUDED.goal_amount,
    current_amount = EXCLUDED.current_amount,
    period_end = EXCLUDED.period_end,
    updated_at = timezone('utc'::text, now());