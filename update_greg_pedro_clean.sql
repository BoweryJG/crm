
-- Update Dr. Greg Pedro's records with actual call transcript analysis

-- First, create a detailed call analysis based on the actual 24-minute conversation
INSERT INTO call_analysis (
    id,
    title,
    call_date,
    duration,
    contact_id,
    practice_id,
    transcript,
    summary,
    sentiment_score,
    tags,
    notes,
    linguistics_analysis_id
) VALUES (
    'c3d4e5f6-a7b8-9012-cdef-345678901235',
    'Website Consolidation Strategy Call - Multiple Digital Properties Discussion',
    '2025-06-19 09:38:42-04:00',
    24,
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Full transcript available - 24 minute call discussing website consolidation, TMJ traffic success, Yomi robotic implants, and digital strategy confusion',
    'Cindi called while driving to discuss urgent website management issues. Main pain points: 1) Managing 10+ domains/websites causing confusion, 2) TMJ site generating significant traffic (20,000+ visitors, last 7 patients from Google), 3) Trying to promote high-margin Yomi robotic implants ($30K per case), 4) Lost 6 implant consultations last week due to poor follow-up, 5) Conflicting opinions from team (Jackie) on direction. Key insight: TMJ site is their most successful digital asset but they want to promote implants. Solution proposed: Consolidate all properties to gregpedromd.com with automated lead capture.',
    0.4,
    ARRAY['website-consolidation', 'TMJ-traffic', 'Yomi-robotics', 'lead-capture', 'Google-Business-Profile', 'analytics', 'WordPress', 'domain-management', 'missed-opportunities', 'system-architecture'],
    'CRITICAL BUSINESS INTELLIGENCE:
    
1. CURRENT DIGITAL ASSETS:
   - 10+ domains in GoDaddy
   - 7 websites, only 3 active (TMJ, Implant, About Face Dental Spa)
   - About Face Dental Spa on WordPress (3-5 years old, got hacked, Russian bot spam)
   - TMJ site: Most successful - 20,000+ visitors, generating last 7 patients
   - Google Business Profile: 150+ reviews, 4.8 stars
   - No unified analytics across properties

2. REVENUE INSIGHTS:
   - Yomi implant cases: $30,000 each ("all we need is one stinking implant case to cover expenses")
   - 6 implant consultations last week - NONE booked (critical failure point)
   - TMJ driving most traffic but lower revenue per patient
   
3. OPERATIONAL CHALLENGES:
   - Cindi changing Google Business Profile URL frequently (confusion)
   - Jackie has opinions causing conflict on direction
   - WordPress site hacked, receiving hundreds of Russian bot submissions
   - No tracking of leads, conversions, or patient journey
   - Staff confusion on which site to direct patients to

4. TECHNICAL BLOCKERS:
   - Jackie granted WordPress admin access but cannot log in
   - No Google Analytics on most sites
   - GoDaddy analytics exist but limited
   - No lead capture automation
   - No unified patient communication system

5. KEY DECISIONS MADE:
   - Agreed to consolidate all properties to gregpedromd.com
   - Focus on three pillars: Yomi/Implants, TMJ, Aesthetics
   - Implement automated lead capture and follow-up
   - Redirect all domains to central hub
   - Jason to take over WordPress access

6. LINGUISTIC PATTERNS:
   - Cindi uses "you know" frequently (uncertainty/seeking validation)
   - Repeated emphasis on confusion ("all over the place")
   - Financial anxiety evident ("cover our expenses")
   - Trust in Jason''s expertise ("you know better")
   - Urgency in voice about missed opportunities',
    'call-2025-06-19-cindi-pedro'
) ON CONFLICT (id) DO UPDATE SET
    transcript = EXCLUDED.transcript,
    summary = EXCLUDED.summary,
    sentiment_score = EXCLUDED.sentiment_score,
    tags = EXCLUDED.tags,
    notes = EXCLUDED.notes;

-- Update sales activity with actual conversation details
UPDATE sales_activities 
SET notes = 'CALL SUMMARY: 24-minute strategy call with Cindi Pedro (driving to office) about website chaos. 

KEY DISCUSSION POINTS:
1. They have 10+ domains, 7 websites, only 3 active
2. TMJ site is crushing it (20K visitors, last 7 patients from Google)
3. But they want to promote Yomi robotic implants ($30K per case)
4. CRITICAL: Lost 6 implant consultations last week - no follow-up system
5. About Face WordPress site was hacked, getting Russian bot spam
6. Cindi keeps changing Google Business Profile URL (confusion)
7. Jackie (team member) has conflicting opinions causing friction

SOLUTION AGREED:
- Consolidate everything to gregpedromd.com
- Redirect all domains to central hub
- Implement automated lead capture
- Jason takes over WordPress management
- Focus on 3 pillars: Implants (Yomi), TMJ, Aesthetics

FOLLOW-UP EMAIL SENT:
Detailed "Digital Turnaround Plan" with Phase 1 (Hub & Spoke consolidation) and Phase 2 (Lead Automation). Activation link to be sent.

CINDI''S STATE OF MIND:
- Overwhelmed by digital chaos
- Anxious about missed revenue (6 lost implant consults)
- Trusts Jason but wants immediate action
- Concerned about losing TMJ traffic while promoting implants'
WHERE id = 'd4e5f6a7-b8c9-0123-defa-456789012345';

-- Create a new activity for the follow-up email sent
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
    'e5f6a7b8-c9d0-1234-efab-678901234568',
    'email',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    '2025-06-19 11:00:00-04:00',
    5,
    'Sent comprehensive "Digital Turnaround Plan" email following strategy call.

EMAIL HIGHLIGHTS:
- Subject: "Detailed Action Plan & Activation: Your New Patient Acquisition System"
- Acknowledged finding about lost implant consultations
- Proposed Hub & Spoke model with gregpedromd.com as central hub
- Phase 1: Consolidate 10+ domains with 301 redirects
- Phase 2: Automated lead capture with instant notifications
- Emphasized capturing the 150+ 5-star Google reviews traffic
- Positioned as fixing "leaky bucket" to stop losing patients
- Clear next step: Activation link for immediate start

KEY VALUE PROPS EMPHASIZED:
1. Stop splitting traffic/authority across 10+ properties
2. Instant email notifications for new leads
3. Patient confirmation emails (improve follow-up)
4. Single analytics dashboard
5. Immediate ROI by capturing existing traffic

Positioned for immediate implementation upon payment activation.',
    'successful',
    (SELECT id FROM auth.users LIMIT 1),
    'c3d4e5f6-a7b8-9012-cdef-345678901234-v2'
) ON CONFLICT (id) DO NOTHING;

-- Add insights about their digital properties
INSERT INTO contacts (
    id,
    first_name,
    last_name,
    email,
    phone_number,
    city,
    state,
    notes,
    user_id,
    summary,
    tech_interests,
    technologies_mentioned,
    estimated_deal_value,
    is_public
) VALUES (
    'f6a7b8c9-d0e1-2345-fabc-789012345678',
    'Jackie',
    'Unknown',
    'unknown@gregpedromd.com',
    'Unknown',
    'Staten Island',
    'NY',
    'Team member at Dr. Pedro''s office. Has opinions on digital strategy that conflict with Cindi''s. Was granted WordPress admin access but cannot log in. Seems to prefer aesthetic/microsite approach.',
    (SELECT id FROM auth.users LIMIT 1),
    'Jackie is a team member who wanted separate aesthetic medicine microsite. Creating internal friction on digital strategy direction.',
    'Microsites, Aesthetic Medicine Marketing',
    'WordPress',
    0,
    false
) ON CONFLICT (id) DO NOTHING;

-- Update practice with discovered information
UPDATE practices
SET name = 'Dr. Greg Pedro MD - Multiple Locations (About Face Dental Spa, TMJ Pain Center, Robotic Implant Center)'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Update contact with digital properties info
UPDATE contacts
SET notes = notes || E'\n\nDISCOVERED DIGITAL PROPERTIES:\n1. aboutfacedentalspa.com (WordPress, 3-5 years old, hacked)\n2. TMJ-site.com (Top performer - 20K visitors)\n3. Staten Island Implant Doctor (GoDaddy)\n4. gregpedromd.com (New React site Jason built)\n5. roboticimplantnyc.com\n6. Jaw Pain Center\n7. Robotic Implant Center\n8. About Face Aesthetics\n9-10. Additional dormant domains\n\nGOOGLE BUSINESS PROFILE:\n- 150+ reviews, 4.8 stars\n- URL keeps changing (Cindi unsure what to feature)\n- Major trust signal being underutilized',
    technologies_mentioned = 'WordPress, GoDaddy Website Builder, React, Google Business Profile, Google Analytics, Russian Bot Attacks, Domain Management',
    estimated_deal_value = 85000
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

-- Create analysis of business metrics discovered
INSERT INTO call_analysis (
    id,
    title,
    call_date, 
    duration,
    contact_id,
    summary,
    tags,
    notes
) VALUES (
    'd5e6f7a8-b9c0-1234-efab-567890123456',
    'Business Metrics Analysis from Call',
    '2025-06-19 09:38:42-04:00',
    1,
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Extracted business metrics: TMJ site 20K visitors, 58 visitors last 30 days on implant site with 17 in last 7 days, 4 conversations. Yomi cases worth $30K each. Lost 6 implant consultations = $180K potential revenue lost in one week.',
    ARRAY['metrics', 'ROI', 'lost-revenue', 'traffic-analysis'],
    'BUSINESS METRICS CAPTURED:
    
TRAFFIC:
- TMJ Site: 20,000+ visitors (timeframe unclear but significant)
- Implant Site: 58 visitors last 30 days (+17 last 7 days)
- Conversations: 4 (unclear conversion metric)

REVENUE IMPACT:
- Yomi implant case value: $30,000
- Lost consultations last week: 6
- Potential revenue lost: $180,000
- "One implant case covers expenses" - indicates monthly overhead ~$30K

CONVERSION FAILURES:
- 6 consultations → 0 bookings (0% conversion)
- No follow-up system in place
- No tracking of patient journey
- Staff unclear on which site to use

DIGITAL SPEND WASTE:
- Paying for 10+ domains
- Maintaining 7 websites  
- Only 3 active
- No unified analytics
- Hacked WordPress site still running'
) ON CONFLICT (id) DO NOTHING;

-- Show summary of updates
SELECT 'Call Analysis Updated' as status, COUNT(*) as records FROM call_analysis WHERE contact_id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
UNION ALL
SELECT 'Sales Activities', COUNT(*) FROM sales_activities WHERE contact_id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
UNION ALL
SELECT 'Contacts in Practice', COUNT(*) FROM contacts WHERE notes LIKE '%Pedro%';