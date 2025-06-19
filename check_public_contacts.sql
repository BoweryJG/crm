-- Check public_contacts structure
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'public_contacts' 
AND table_schema = 'public'
ORDER BY ordinal_position;