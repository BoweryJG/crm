-- Add Dr. Greg Pedro to CRM with full details

-- Create practice first
INSERT INTO practices (
    id,
    name
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD - 4300 Hylan Blvd, Staten Island, NY 10312'
) ON CONFLICT (id) DO NOTHING;

-- Add Dr. Greg Pedro with all details
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone_number,
    cell,
    city,
    state,
    specialty,
    notes,
    user_id,
    summary,
    tech_interests,
    technologies_mentioned,
    contact_priority,
    is_public,
    territory
) VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Greg',
    'Pedro',
    'gcpedro2018@gmail.com',
    '610-780-9156',
    '610-780-9156',
    'Staten Island',
    'NY',
    'TMJ, Robotic Implants, Aesthetics',
    'Decision maker for practice technology and marketing. Practice at 4300 Hylan Blvd. Website: gregpedromd.com. Interested in consolidating multiple websites (TMJ, robotic implants, aesthetics) and improving lead capture across service lines. Discussed unified web presence strategy.',
    (SELECT id FROM auth.users LIMIT 1),
    'Dr. Greg Pedro runs a multi-specialty dental practice in Staten Island offering TMJ treatment, robotic implants, and aesthetic services. Currently managing fragmented web presence across multiple sites. Strategic discussion on 6/19 about website consolidation and lead capture optimization. Ready to move forward with unified platform.',
    ARRAY['Website Development', 'Lead Capture Systems', 'SEO', 'Digital Marketing', 'Analytics', 'Conversion Tracking'],
    ARRAY['Robotic Implants', 'TMJ Treatment Systems', 'Aesthetic Equipment', 'Digital Workflow', 'Practice Management Software'],
    'high',
    false,
    'Staten Island'
) ON CONFLICT (id) DO NOTHING;

-- Add Cindi Weiss with all details
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone_number,
    cell,
    city,
    state,
    specialty,
    notes,
    user_id,
    summary,
    contact_priority,
    is_public,
    territory
) VALUES (
    'e5f6a7b8-c9d0-1234-efab-678901234567',
    'Cindi',
    'Weiss',
    'gcpedro2018@gmail.com',
    '732-309-7895',
    '732-309-7895',
    'Staten Island',
    'NY',
    'Office Management',
    'Office Manager and Dr. Pedro''s wife. Primary contact for administrative and operational decisions. Handles marketing initiatives and website management. Key decision maker for practice operations.',
    (SELECT id FROM auth.users LIMIT 1),
    'Cindi Weiss is the Office Manager at Dr. Greg Pedro MD and his wife. She manages all administrative aspects of the practice and is heavily involved in marketing decisions. Primary point of contact for operational matters and implementation of new systems.',
    'high',
    false,
    'Staten Island'
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
    'Website Consolidation and Lead Capture Strategy Discussion with Dr. Greg Pedro',
    '2025-06-19 09:38:42-04:00',
    24,
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Strategic 24-minute call with Dr. Greg Pedro discussing consolidation of multiple service websites (TMJ, robotic implants, aesthetics) into a unified platform. Dr. Pedro expressed frustration with current fragmented web presence and poor lead conversion rates. Discussed implementing unified lead capture forms with service-specific fields, creating dedicated landing pages for each service line, and setting up proper analytics and conversion tracking.',
    0.7,
    ARRAY['website-consolidation', 'lead-capture', 'TMJ', 'robotic-implants', 'aesthetics', 'digital-marketing', 'SEO', 'conversion-optimization', 'analytics', 'landing-pages'],
    'Key decisions from call: 
1) Consolidate 3 separate websites into one main domain (gregpedromd.com) with service sections
2) Implement unified lead capture forms with service-specific fields
3) Create dedicated landing pages for each service line (TMJ, Implants, Aesthetics)
4) Set up proper Google Analytics and conversion tracking
5) Implement call tracking for each service line
6) Create service-specific email automation sequences

Pain points discussed:
- Fragmented online presence confusing patients
- Poor lead conversion rates
- Difficulty tracking ROI across service lines
- Inconsistent branding across sites
- Manual lead management process

Dr. Pedro is ready to move forward immediately. Budget is approved. Cindi will be primary contact for implementation.'
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
    'Strategic discussion about website consolidation and lead capture optimization. Dr. Pedro is ready to move forward with unified web presence strategy. Main pain points: fragmented online presence, poor lead conversion, difficulty tracking ROI across service lines. Action items: 1) Prepare website consolidation proposal with timeline and pricing, 2) Create mockups for unified site with service-specific sections, 3) Schedule follow-up meeting to present solution (target: next week), 4) Research competitors websites for TMJ and robotic implant services, 5) Prepare lead capture optimization recommendations, 6) Include call tracking and analytics setup in proposal.',
    'successful',
    (SELECT id FROM auth.users LIMIT 1),
    'c3d4e5f6-a7b8-9012-cdef-345678901234'
) ON CONFLICT (id) DO NOTHING;

-- Verify what was added
SELECT 'Practice Added:' as status, name FROM practices WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name || ' - ' || email || ' - ' || phone_number FROM contacts WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name || ' - ' || email || ' - ' || phone_number FROM contacts WHERE id = 'e5f6a7b8-c9d0-1234-efab-678901234567'
UNION ALL
SELECT 'Call Analysis Added:', substring(title, 1, 50) || '...' FROM call_analysis WHERE id = 'c3d4e5f6-a7b8-9012-cdef-345678901234'
UNION ALL
SELECT 'Activity Logged:', type || ' on ' || date::date || ' - ' || outcome FROM sales_activities WHERE id = 'd4e5f6a7-b8c9-0123-defa-456789012345';