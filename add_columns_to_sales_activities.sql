-- Add user_id column to sales_activities to link to a sales rep
ALTER TABLE public.sales_activities
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add foreign key constraint for user_id to auth.users
-- Ensure users exist in auth.users before creating this constraint if sales_activities already has data
ALTER TABLE public.sales_activities
ADD CONSTRAINT fk_sales_activities_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL; -- Or ON DELETE CASCADE, depending on desired behavior

-- Add call_analysis_id column to sales_activities to link to a call_analysis record
ALTER TABLE public.sales_activities
ADD COLUMN IF NOT EXISTS call_analysis_id UUID;

-- Add foreign key constraint for call_analysis_id to call_analysis table
-- Ensure records exist in call_analysis before creating this constraint if sales_activities already has data
ALTER TABLE public.sales_activities
ADD CONSTRAINT fk_sales_activities_call_analysis
FOREIGN KEY (call_analysis_id)
REFERENCES public.call_analysis(id)
ON DELETE SET NULL; -- Or ON DELETE CASCADE, depending on desired behavior

COMMENT ON COLUMN public.sales_activities.user_id IS 'Links the sales activity to a specific sales rep in auth.users.';
COMMENT ON COLUMN public.sales_activities.call_analysis_id IS 'Links a call activity directly to a record in call_analysis, if applicable.';
