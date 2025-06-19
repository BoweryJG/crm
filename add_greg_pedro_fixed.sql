-- Add Dr. Greg Pedro to CRM with call activity
-- Fixed version matching actual database schema

-- First, create the practice (if not exists)
INSERT INTO practices (
    id,
    name,
    city,
    state,
    zip_code,
    phone,
    email,
    website,
    type,
    size,
    specialty
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD - 4300 Hylan Blvd',
    'Staten Island',
    'NY',
    '10312',
    '610-780-9156',
    'gcpedro2018@gmail.com',
    'https://gregpedromd.com',
    'dental',
    'medium',
    'TMJ, Robotic Implants, Aesthetics'
) ON CONFLICT (id) DO NOTHING;

-- Add Dr. Greg Pedro as a contact
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone,
    practice_id,
    practice_name,
    city,
    state,
    specialty,
    notes
) VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Greg',
    'Pedro',
    'gcpedro2018@gmail.com',
    '610-780-9156',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD',
    'Staten Island',
    'NY',
    'TMJ, Robotic Implants, Aesthetics',
    'Decision maker for practice technology and marketing. Interested in consolidating multiple websites and improving lead capture across service lines. Practice at 4300 Hylan Blvd.'
) ON CONFLICT (id) DO NOTHING;

-- Add Cindi Weiss (Office Manager/Wife) as a contact
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone,
    practice_id,
    practice_name,
    city,
    state,
    specialty,
    notes
) VALUES (
    'e5f6a7b8-c9d0-1234-efab-678901234567',
    'Cindi',
    'Weiss',
    'gcpedro2018@gmail.com',
    '732-309-7895',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD',
    'Staten Island',
    'NY',
    'Office Management',
    'Office Manager and Dr. Pedro''s wife. Primary contact for administrative and operational decisions. Handles marketing initiatives and website management.'
) ON CONFLICT (id) DO NOTHING;

-- Create call analysis record
INSERT INTO call_analysis (
    id,
    title,
    call_date,
    duration,
    contact_id,
    practice_id,
    summary,
    sentiment_score,
    tags,
    notes
) VALUES (
    'c3d4e5f6-a7b8-9012-cdef-345678901234',
    'Website Consolidation and Lead Capture Strategy Discussion',
    '2025-06-19 09:38:42-04:00',
    24,
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Discussed consolidating multiple service websites (TMJ, robotic implants, aesthetics) into a unified platform with improved lead capture. Dr. Pedro expressed concerns about current fragmented web presence and poor lead conversion. Explored strategies for service-specific landing pages within main site structure.',
    0.7,
    ARRAY['website-consolidation', 'lead-capture', 'TMJ', 'robotic-implants', 'aesthetics', 'digital-marketing', 'SEO', 'conversion-optimization'],
    'Key decisions: 1) Consolidate 3 separate websites into one main domain with service sections, 2) Implement unified lead capture forms with service-specific fields, 3) Create dedicated landing pages for each service line, 4) Set up proper analytics and conversion tracking'
) ON CONFLICT (id) DO NOTHING;

-- Create sales activity linked to the call analysis
INSERT INTO sales_activities (
    id,
    type,
    contact_id,
    date,
    duration,
    notes,
    outcome,
    user_id,
    call_analysis_id
) VALUES (
    'd4e5f6a7-b8c9-0123-defa-456789012345',
    'call',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    '2025-06-19 09:38:42-04:00',
    24,
    'Strategic discussion about website consolidation and lead capture optimization. Dr. Pedro is ready to move forward with unified web presence strategy. Main pain points: fragmented online presence, poor lead conversion, difficulty tracking ROI across service lines. Next steps: 1. Prepare website consolidation proposal with timeline and pricing, 2. Create mockups for unified site with service-specific sections, 3. Schedule follow-up meeting to present solution (target: next week), 4. Research competitors websites for TMJ and robotic implant services, 5. Prepare lead capture optimization recommendations',
    'successful',
    (SELECT id FROM auth.users LIMIT 1),
    'c3d4e5f6-a7b8-9012-cdef-345678901234'
) ON CONFLICT (id) DO NOTHING;

-- Verify the data was inserted
SELECT 'Practice Added:' as status, name, city, state FROM practices WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name, email, phone FROM contacts WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name, email, phone FROM contacts WHERE id = 'e5f6a7b8-c9d0-1234-efab-678901234567'
UNION ALL
SELECT 'Call Analysis Added:', title, call_date::text, duration::text || ' minutes' FROM call_analysis WHERE id = 'c3d4e5f6-a7b8-9012-cdef-345678901234'
UNION ALL
SELECT 'Activity Logged:', type, date::text, outcome FROM sales_activities WHERE id = 'd4e5f6a7-b8c9-0123-defa-456789012345';