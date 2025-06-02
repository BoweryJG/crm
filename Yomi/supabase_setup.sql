-- Create yomistrike_sessions table for tracking user attempts
CREATE TABLE IF NOT EXISTS yomistrike_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    method TEXT NOT NULL CHECK (method IN ('freehand', 'static', 'yomi')),
    mode TEXT NOT NULL CHECK (mode IN ('explore', 'challenge', 'tutorial')),
    score INTEGER,
    precision_mm DECIMAL(10, 2),
    time_seconds DECIMAL(10, 1),
    browser_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_yomistrike_sessions_user_id ON yomistrike_sessions(user_id);
CREATE INDEX idx_yomistrike_sessions_created_at ON yomistrike_sessions(created_at);

-- Enable Row Level Security
ALTER TABLE yomistrike_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own sessions
CREATE POLICY "Users can view own sessions" ON yomistrike_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own sessions
CREATE POLICY "Users can insert own sessions" ON yomistrike_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a view for leaderboard (best scores by method)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    s.method,
    s.precision_mm,
    s.score,
    s.time_seconds,
    u.raw_user_meta_data->>'full_name' as user_name,
    u.raw_user_meta_data->>'avatar_url' as avatar_url,
    s.completed_at
FROM yomistrike_sessions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.score IS NOT NULL
ORDER BY s.method, s.precision_mm ASC, s.time_seconds ASC
LIMIT 100;