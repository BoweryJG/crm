-- Create mission_status table
CREATE TABLE IF NOT EXISTS public.mission_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    current_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    target_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    momentum_status TEXT CHECK (momentum_status IN ('stable', 'accelerating', 'at_risk')) DEFAULT 'stable',
    eta_days INTEGER DEFAULT 0,
    progress_percent DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mission_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.mission_status
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.mission_status
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.mission_status
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.mission_status
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial data
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