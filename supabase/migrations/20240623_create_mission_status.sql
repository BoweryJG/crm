-- Create mission_status table
CREATE TABLE IF NOT EXISTS public.mission_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    mission_type TEXT NOT NULL,
    progress NUMERIC(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    target_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_mission_status_user_id ON public.mission_status(user_id);
CREATE INDEX idx_mission_status_created_at ON public.mission_status(created_at DESC);
CREATE INDEX idx_mission_status_status ON public.mission_status(status);

-- Enable RLS
ALTER TABLE public.mission_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own mission status"
    ON public.mission_status
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mission status"
    ON public.mission_status
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mission status"
    ON public.mission_status
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mission status"
    ON public.mission_status
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_mission_status_updated_at
    BEFORE UPDATE ON public.mission_status
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();