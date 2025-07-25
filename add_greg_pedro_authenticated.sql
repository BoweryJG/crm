-- Add Dr. Greg Pedro to YOUR private CRM (authenticated contacts)

-- Create practice first
INSERT INTO practices (
    id,
    name
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Greg Pedro MD - 4300 Hylan Blvd, Staten Island, NY 10312'
) ON CONFLICT (id) DO NOTHING;

-- Add Dr. Greg Pedro to YOUR contacts (not public demo data)
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
    territory,
    overall_score,
    lead_tier,
    estimated_deal_value,
    purchase_timeline
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
    (SELECT id FROM auth.users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())), -- Your user ID
    'Dr. Greg Pedro runs a multi-specialty dental practice in Staten Island offering TMJ treatment, robotic implants, and aesthetic services. Currently managing fragmented web presence across multiple sites. Strategic discussion on 6/19 about website consolidation and lead capture optimization. Ready to move forward with unified platform.',
    'Website Development, Lead Capture Systems, SEO, Digital Marketing, Analytics, Conversion Tracking',
    'Robotic Implants, TMJ Treatment Systems, Aesthetic Equipment, Digital Workflow, Practice Management Software',
    'high',
    false, -- This is YOUR private contact, not public demo data
    'Staten Island',
    95, -- High score due to immediate need and budget approval
    'A', -- Top tier lead
    75000, -- Estimated value for website consolidation project
    'Immediate' -- Ready to move forward now
) ON CONFLICT (id) DO NOTHING;

-- Add Cindi Weiss to YOUR contacts
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
    territory,
    overall_score,
    lead_tier
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
    (SELECT id FROM auth.users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())), -- Your user ID
    'Cindi Weiss is the Office Manager at Dr. Greg Pedro MD and his wife. She manages all administrative aspects of the practice and is heavily involved in marketing decisions. Primary point of contact for operational matters and implementation of new systems.',
    'high',
    false, -- This is YOUR private contact
    'Staten Island',
    90, -- High score as key decision maker
    'A' -- Top tier due to decision-making role
) ON CONFLICT (id) DO NOTHING;

-- For call_analysis, we need to handle the foreign key constraint
-- Option 1: Skip call_analysis if it requires public_contacts
-- Option 2: Modify the foreign key (requires admin access)
-- For now, let's create the sales activity without call_analysis

-- Create sales activity for YOUR private CRM
INSERT INTO sales_activities (
    id,
    type,
    contact_id,
    date,
    duration,
    notes,
    outcome,
    user_id
) VALUES (
    'd4e5f6a7-b8c9-0123-defa-456789012345',
    'call',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    '2025-06-19 09:38:42-04:00',
    24,
    'Strategic discussion about website consolidation and lead capture optimization. Dr. Pedro is ready to move forward with unified web presence strategy. 

Key Points Discussed:
- Consolidating TMJ, robotic implants, and aesthetics websites into gregpedromd.com
- Implementing unified lead capture with service-specific forms
- Creating dedicated landing pages for each service line
- Setting up Google Analytics and conversion tracking
- Implementing call tracking for ROI measurement
- Building email automation sequences for each service

Pain Points:
- Fragmented online presence confusing patients
- Poor lead conversion rates
- Difficulty tracking ROI across service lines
- Inconsistent branding
- Manual lead management

Action Items:
1. Prepare website consolidation proposal with timeline and pricing
2. Create mockups for unified site with service-specific sections
3. Schedule follow-up meeting to present solution (target: next week)
4. Research competitors websites for TMJ and robotic implant services
5. Prepare lead capture optimization recommendations
6. Include call tracking and analytics setup in proposal

Budget approved. Cindi will be primary contact for implementation.',
    'successful',
    (SELECT id FROM auth.users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) -- Your user ID
) ON CONFLICT (id) DO NOTHING;

-- Verify what was added to YOUR private CRM
SELECT 'Practice Added:' as status, name FROM practices WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name || ' - ' || email || ' - ' || phone_number FROM contacts WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
UNION ALL
SELECT 'Contact Added:', first_name || ' ' || last_name || ' - ' || email || ' - ' || phone_number FROM contacts WHERE id = 'e5f6a7b8-c9d0-1234-efab-678901234567'
UNION ALL
SELECT 'Activity Logged:', type || ' on ' || date::date || ' - ' || outcome FROM sales_activities WHERE id = 'd4e5f6a7-b8c9-0123-defa-456789012345';