-- Add Dr. Greg Pedro to CRM - Minimal version

-- First, create the practice with only required fields
INSERT INTO practices (
    id,
    name
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD - 4300 Hylan Blvd, Staten Island, NY'
) ON CONFLICT (id) DO NOTHING;

-- Add Dr. Greg Pedro as a contact
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone,
    practice_id,
    practice_name
) VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Greg',
    'Pedro',
    'gcpedro2018@gmail.com',
    '610-780-9156',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD'
) ON CONFLICT (id) DO NOTHING;

-- Add Cindi Weiss as a contact
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone,
    practice_id,
    practice_name
) VALUES (
    'e5f6a7b8-c9d0-1234-efab-678901234567',
    'Cindi',
    'Weiss',
    'gcpedro2018@gmail.com',
    '732-309-7895',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD'
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
    'Key decisions: 1) Consolidate 3 separate websites into one main domain with service sections, 2) Implement unified lead capture forms with service-specific fields, 3) Create dedicated landing pages for each service line, 4) Set up proper analytics and conversion tracking. Practice location: 4300 Hylan Blvd, Staten Island, NY. Website: gregpedromd.com'
) ON CONFLICT (id) DO NOTHING;

-- Create sales activity
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
SELECT 'Practice Added:' as status, name FROM practices WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name FROM contacts WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name FROM contacts WHERE id = 'e5f6a7b8-c9d0-1234-efab-678901234567'
UNION ALL
SELECT 'Call Analysis Added:', title FROM call_analysis WHERE id = 'c3d4e5f6-a7b8-9012-cdef-345678901234'
UNION ALL
SELECT 'Activity Logged:', type || ' - ' || outcome FROM sales_activities WHERE id = 'd4e5f6a7-b8c9-0123-defa-456789012345';