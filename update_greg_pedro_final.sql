-- Update Dr. Greg Pedro with call transcript analysis

-- Update existing sales activity with detailed notes
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

-- Update Dr. Greg Pedro contact with discovered information
UPDATE contacts
SET notes = notes || E'\n\nDISCOVERED DIGITAL PROPERTIES:\n1. aboutfacedentalspa.com (WordPress, 3-5 years old, hacked)\n2. TMJ-site.com (Top performer - 20K visitors)\n3. Staten Island Implant Doctor (GoDaddy)\n4. gregpedromd.com (New React site Jason built)\n5. roboticimplantnyc.com\n6. Jaw Pain Center\n7. Robotic Implant Center\n8. About Face Aesthetics\n9-10. Additional dormant domains\n\nGOOGLE BUSINESS PROFILE:\n- 150+ reviews, 4.8 stars\n- URL keeps changing (Cindi unsure what to feature)\n- Major trust signal being underutilized\n\nKEY METRICS FROM CALL:\n- Lost Revenue: $180,000 (6 implant consultations x $30K)\n- TMJ Site Success: 20,000+ visitors\n- Implant Site: 58 visitors/month\n- WordPress hacked with Russian bots\n- "One implant case covers expenses"',
    technologies_mentioned = 'WordPress, GoDaddy Website Builder, React, Google Business Profile, Google Analytics, Russian Bot Attacks, Domain Management',
    estimated_deal_value = 85000,
    tech_interests = 'Website Consolidation, Lead Capture Automation, Analytics, SEO, Conversion Tracking, Domain Management',
    contact_priority = 'critical'
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

-- Add Jackie as a contact
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

-- Update practice name to reflect multiple locations
UPDATE practices
SET name = 'Dr. Greg Pedro MD - Multiple Locations (About Face Dental Spa, TMJ Pain Center, Robotic Implant Center)'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Add follow-up email activity
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
    (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT (id) DO NOTHING;

-- Show what was updated
SELECT 'Updates Complete' as status, 
       'Dr. Greg Pedro' as contact,
       'Call transcript analysis added' as action;