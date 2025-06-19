-- Add Dr. Greg Pedro to CRM - Simple version

-- Create practice with just id and name
INSERT INTO practices (
    id,
    name
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD - 4300 Hylan Blvd, Staten Island, NY 10312 - Phone: 610-780-9156 - Website: gregpedromd.com'
) ON CONFLICT (id) DO NOTHING;

-- Create contacts with just required fields
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    practice_id
) VALUES 
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Greg', 'Pedro', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
    ('e5f6a7b8-c9d0-1234-efab-678901234567', 'Cindi', 'Weiss', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
ON CONFLICT (id) DO NOTHING;

-- Show what was added
SELECT 'Added practice:' as info, name FROM practices WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'Added contact:', first_name || ' ' || last_name FROM contacts WHERE id IN ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'e5f6a7b8-c9d0-1234-efab-678901234567');