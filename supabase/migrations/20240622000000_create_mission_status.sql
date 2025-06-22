-- Create mission_status table for tracking sales mission progress
CREATE TABLE IF NOT EXISTS public.mission_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    current_revenue NUMERIC NOT NULL DEFAULT 0,
    target_revenue NUMERIC NOT NULL DEFAULT 0,
    momentum_status TEXT NOT NULL DEFAULT 'stable' CHECK (momentum_status IN ('stable', 'accelerating', 'at_risk')),
    eta_days INTEGER NOT NULL DEFAULT 0,
    progress_percent NUMERIC NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for efficient ordering
CREATE INDEX idx_mission_status_created_at ON public.mission_status(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_mission_status_updated_at 
    BEFORE UPDATE ON public.mission_status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.mission_status ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to read mission status
CREATE POLICY "Allow authenticated users to read mission_status" 
    ON public.mission_status 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Create a policy to allow authenticated users to insert mission status
CREATE POLICY "Allow authenticated users to insert mission_status" 
    ON public.mission_status 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Create a policy to allow authenticated users to update mission status
CREATE POLICY "Allow authenticated users to update mission_status" 
    ON public.mission_status 
    FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Insert initial sample data (optional - remove in production)
INSERT INTO public.mission_status (
    current_revenue,
    target_revenue,
    momentum_status,
    eta_days,
    progress_percent
) VALUES (
    806000,
    1300000,
    'accelerating',
    11,
    62
);