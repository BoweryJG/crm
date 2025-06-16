-- Simple, safe fix for SUIS schema cache issue
-- This only reads data and sends a refresh signal

-- 1. Just verify the column exists (read-only)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'suis_intelligence_profiles' 
AND column_name = 'profile_type';

-- 2. Send a simple refresh signal
NOTIFY pgrst, 'reload schema';

-- That's it! No structural changes.