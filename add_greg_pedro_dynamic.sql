-- Add Dr. Greg Pedro to CRM - Dynamic version that adapts to your schema

-- First, let's see what columns we actually have
\echo 'Checking practices table structure...'
\d practices

\echo 'Checking contacts table structure...'
\d contacts

-- Create practice with minimal fields (these should exist)
INSERT INTO practices (
    id,
    name
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD - 4300 Hylan Blvd, Staten Island, NY 10312 - Phone: 610-780-9156 - Website: gregpedromd.com'
) ON CONFLICT (id) DO NOTHING;

-- Create contacts with minimal fields
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    practice_id
) VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Greg',
    'Pedro',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO contacts (
    id,
    first_name,
    last_name,
    practice_id
) VALUES (
    'e5f6a7b8-c9d0-1234-efab-678901234567',
    'Cindi',
    'Weiss',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
) ON CONFLICT (id) DO NOTHING;

-- Update with additional info if columns exist
UPDATE contacts 
SET email = 'gcpedro2018@gmail.com'
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012' 
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'email');

UPDATE contacts 
SET email = 'gcpedro2018@gmail.com'
WHERE id = 'e5f6a7b8-c9d0-1234-efab-678901234567'
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'email');

-- Verify what was inserted
\echo 'Data inserted:'
SELECT * FROM practices WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
SELECT * FROM contacts WHERE practice_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';