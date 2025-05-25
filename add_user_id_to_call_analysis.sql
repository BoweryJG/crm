-- Add user_id column to call_analysis to link to a sales rep
ALTER TABLE public.call_analysis
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add foreign key constraint for user_id to auth.users
-- Ensure users exist in auth.users before creating this constraint if call_analysis already has data
ALTER TABLE public.call_analysis
ADD CONSTRAINT fk_call_analysis_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL; -- Or ON DELETE CASCADE, depending on desired behavior

COMMENT ON COLUMN public.call_analysis.user_id IS 'Links the call to a specific sales rep in auth.users.';
