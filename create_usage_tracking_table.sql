-- Create usage tracking table for Rep^x subscription features
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_type TEXT NOT NULL CHECK (feature_type IN ('calls', 'emails', 'canvas_scans')),
    usage_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_feature_type ON usage_tracking(feature_type);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_created_at ON usage_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_feature_date ON usage_tracking(user_id, feature_type, created_at);

-- Enable RLS
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own usage"
    ON usage_tracking
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
    ON usage_tracking
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Optional: Create a function to get monthly usage summary
CREATE OR REPLACE FUNCTION get_monthly_usage_summary(target_user_id UUID, target_month DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    feature_type TEXT,
    total_usage BIGINT,
    month_start DATE,
    month_end DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ut.feature_type,
        SUM(ut.usage_count) as total_usage,
        DATE_TRUNC('month', target_month)::DATE as month_start,
        (DATE_TRUNC('month', target_month) + INTERVAL '1 month - 1 day')::DATE as month_end
    FROM usage_tracking ut
    WHERE 
        ut.user_id = target_user_id
        AND ut.created_at >= DATE_TRUNC('month', target_month)
        AND ut.created_at < DATE_TRUNC('month', target_month) + INTERVAL '1 month'
    GROUP BY ut.feature_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;