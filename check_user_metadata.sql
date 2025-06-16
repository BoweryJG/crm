-- Check current user metadata
SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name,
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'jasonwilliamgolden@gmail.com';