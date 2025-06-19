-- First, let's see what columns actually exist in contacts
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
AND table_schema = 'public'
ORDER BY ordinal_position;