-- Populate existing public tables with mock data
-- This version matches the actual table structures

-- 1. Insert public_practices (already has correct structure)
INSERT INTO public_practices (id, name, address, city, state, zip, phone, email, website, type, size, status, patient_volume, annual_revenue) VALUES
('11111111-1111-1111-1111-111111111111', 'Manhattan Dental Excellence', '123 Park Ave', 'New York', 'NY', '10017', '212-555-0100', 'info@manhattandental.com', 'https://manhattandental.com', 'dental', 'large', 'active', 450, 3500000),
('22222222-2222-2222-2222-222222222222', 'Brooklyn Aesthetic Center', '456 Court St', 'Brooklyn', 'NY', '11201', '718-555-0200', 'hello@brooklynaesthetic.com', 'https://brooklynaesthetic.com', 'aesthetic', 'medium', 'active', 200, 1800000),
('33333333-3333-3333-3333-333333333333', 'Chicago Smile Studio', '789 Michigan Ave', 'Chicago', 'IL', '60611', '312-555-0300', 'contact@chicagosmile.com', 'https://chicagosmile.com', 'dental', 'medium', 'active', 300, 2200000),
('44444444-4444-4444-4444-444444444444', 'Beverly Hills Aesthetics', '321 Rodeo Dr', 'Beverly Hills', 'CA', '90210', '310-555-0400', 'info@bhaesthetics.com', 'https://bhaesthetics.com', 'aesthetic', 'large', 'active', 500, 5000000),
('55555555-5555-5555-5555-555555555555', 'Miami Beach Dental', '654 Ocean Dr', 'Miami Beach', 'FL', '33139', '305-555-0500', 'smile@miamibeachdental.com', 'https://miamibeachdental.com', 'dental', 'small', 'active', 150, 1200000);

-- 2. Insert public_call_analysis (using actual column structure)
INSERT INTO public_call_analysis (id, title, call_date, duration, contact_id, sentiment_score, transcript, summary, key_topics, objections, next_steps, user_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'Yomi Robotics Demo Call - Dr. Chen', NOW() - INTERVAL '2 days', 2400, 
(SELECT id FROM public_contacts WHERE email = 'david.chen@smiledesigns.com' LIMIT 1), 0.85,
'[00:00] Rep: Good morning Dr. Chen, thank you for taking my call. I wanted to follow up on the Yomi Robotics demo we discussed...
[02:15] Dr. Chen: Yes, I remember. We are definitely interested but need to understand the ROI better...
[05:30] Rep: Absolutely. Let me share some case studies from practices similar to yours...
[12:45] Dr. Chen: The precision aspect is very appealing. Our younger patients especially appreciate high-tech solutions...
[18:20] Rep: I can arrange an in-person demo next week. Would Tuesday or Thursday work better?
[22:30] Dr. Chen: Thursday afternoon would be perfect. Can you also bring financing options?
[25:00] Rep: Of course! I will email you the details and see you Thursday at 2 PM.',
'Strong interest in Yomi Robotics system. Dr. Chen particularly interested in precision benefits and patient appeal. Demo scheduled for Thursday.',
ARRAY['robotics', 'precision', 'ROI', 'patient satisfaction', 'financing'],
ARRAY['need to understand ROI', 'financing concerns'],
ARRAY['In-person demo Thursday 2 PM', 'Prepare financing options', 'Send case studies via email'],
'demo-user'),

('c2222222-2222-2222-2222-222222222222', 'Allergan Partnership Discussion - Dr. Martinez', NOW() - INTERVAL '5 days', 1800,
(SELECT id FROM public_contacts WHERE email = 'sarah.martinez@aestheticmed.com' LIMIT 1), 0.92,
'[00:00] Rep: Dr. Martinez, I have exciting news about our new Allergan partnership program...
[03:20] Dr. Martinez: This sounds exactly like what we have been looking for! Tell me more...
[08:45] Rep: You would get exclusive pricing on the full portfolio plus training credits...
[15:30] Dr. Martinez: We go through about 200 units of Botox monthly. What kind of savings are we talking about?
[20:15] Rep: With your volume, you would save approximately 15% plus get quarterly bonuses...
[25:00] Dr. Martinez: I am ready to move forward. What are the next steps?',
'Extremely positive call. Dr. Martinez ready to join Allergan partnership program immediately. High-volume practice with 200+ units monthly.',
ARRAY['partnership program', 'volume pricing', 'training credits', 'exclusive benefits'],
ARRAY['none - ready to proceed'],
ARRAY['Send partnership agreement', 'Schedule onboarding call', 'Arrange initial product delivery'],
'demo-user');

-- 3. Insert public_linguistics_analysis (using actual column structure)
INSERT INTO public_linguistics_analysis (id, call_id, analysis_date, sentiment_score, key_phrases, summary) VALUES
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', 0.85,
ARRAY['definitely interested', 'understand ROI', 'precision appealing', 'high-tech solutions', 'Thursday perfect'],
'Positive engagement with buying signals. Customer focused on ROI and technology benefits. Clear next steps established.'),

('a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days', 0.92,
ARRAY['exactly what we need', 'ready to move forward', '200 units monthly', 'exclusive pricing'],
'Extremely positive sentiment. Strong buying intent with immediate action requested. High-value customer.');

-- 4. Update linguistics_analysis_id in call_analysis
UPDATE public_call_analysis SET linguistics_analysis_id = 'a1111111-1111-1111-1111-111111111111' WHERE id = 'c1111111-1111-1111-1111-111111111111';
UPDATE public_call_analysis SET linguistics_analysis_id = 'a2222222-2222-2222-2222-222222222222' WHERE id = 'c2222222-2222-2222-2222-222222222222';

-- 5. Insert public_sales_activities (using actual column structure with UUID user_id)
INSERT INTO public_sales_activities (id, user_id, contact_id, type, date, duration, notes, outcome) VALUES
('e1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE email = 'david.chen@smiledesigns.com' LIMIT 1),
'call', NOW() - INTERVAL '10 days', 15,
'Initial cold call. Introduced Yomi Robotics system. Dr. Chen showed interest.',
'successful'),

('e2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE email = 'david.chen@smiledesigns.com' LIMIT 1),
'email', NOW() - INTERVAL '8 days', 5,
'Sent follow-up email with case studies and ROI calculator.',
'successful'),

('e3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE email = 'sarah.martinez@aestheticmed.com' LIMIT 1),
'meeting', NOW() - INTERVAL '7 days', 60,
'In-person meeting at practice. Toured facility, discussed aesthetic portfolio.',
'successful');

-- 6. Insert public_research_projects (using actual column structure)
INSERT INTO public_research_projects (id, title, description, status, created_by, tags, priority, progress, user_id) VALUES
('b1111111-1111-1111-1111-111111111111', 'NYC Dental Implant Market Analysis', 
'Comprehensive analysis of dental implant adoption rates in NYC metro area', 
'active', '00000000-0000-0000-0000-000000000001',
ARRAY['market research', 'dental implants', 'NYC', 'competitive analysis'],
1, 75, 'demo-user'),

('b2222222-2222-2222-2222-222222222222', 'Aesthetic Injectable Trends 2025',
'Research on emerging trends in aesthetic injectables and patient preferences',
'active', '00000000-0000-0000-0000-000000000001',
ARRAY['aesthetics', 'injectables', 'trends', 'consumer behavior'],
2, 40, 'demo-user');

-- 7. Insert public_research_documents
INSERT INTO public_research_documents (id, project_id, title, content, document_type, created_by, tags) VALUES
('d1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 
'Executive Summary - NYC Implant Market',
'The NYC dental implant market shows 15% YoY growth with increasing adoption of guided surgery systems...',
'report', '00000000-0000-0000-0000-000000000001',
ARRAY['executive summary', 'market data', 'growth analysis']),

('d2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222',
'Patient Survey Results - Injectable Preferences',
'Survey of 500 patients reveals strong preference for natural-looking results and provider expertise...',
'analysis', '00000000-0000-0000-0000-000000000001',
ARRAY['survey', 'patient preferences', 'data analysis']);

-- 8. Insert public_companies
INSERT INTO public_companies (id, name, website, industry, headquarters, description, products, founded_year, market_share) VALUES
('c0111111-1111-1111-1111-111111111111', 'Straumann Group', 'https://www.straumann.com', 'dental',
'Basel, Switzerland', 'Global leader in dental implants and restorative dentistry',
ARRAY['Dental Implants', 'Straumann BLX', 'Neodent', 'Clear Aligners', 'Digital Solutions'],
1954, 25.5),

('c0222222-2222-2222-2222-222222222222', 'Allergan Aesthetics', 'https://www.allerganaesthetics.com', 'aesthetic',
'Irvine, CA', 'Leading provider of aesthetic medicine products including Botox and Juvederm',
ARRAY['Botox', 'Juvederm', 'CoolSculpting', 'Latisse', 'Natrelle Implants'],
1950, 35.2);

-- 9. Insert public_procedures
INSERT INTO public_procedures (id, name, category, subcategory, description, avg_cost_min, avg_cost_max, popularity_score) VALUES
('f1111111-1111-1111-1111-111111111111', 'Dental Implants', 'dental', 'restorative',
'Surgical placement of titanium implants to replace missing teeth',
3000, 6000, 9),

('f2222222-2222-2222-2222-222222222222', 'Botox Treatment', 'aesthetic', 'injectables',
'Botulinum toxin injections for wrinkle reduction and facial rejuvenation',
300, 800, 10);

-- Add more call analysis records for variety
INSERT INTO public_call_analysis (id, title, call_date, duration, sentiment_score, transcript, summary, key_topics, user_id) VALUES
('c3333333-3333-3333-3333-333333333333', 'Follow-up Call - Practice Expansion', NOW() - INTERVAL '3 days', 900, 0.75,
'Discussion about expanding practice capabilities with new technology...',
'Interested in expansion options but needs committee approval first.',
ARRAY['expansion', 'technology', 'committee approval'],
'demo-user'),

('c4444444-4444-4444-4444-444444444444', 'Product Training Request', NOW() - INTERVAL '1 day', 1200, 0.88,
'Customer requesting additional training for new staff members...',
'High satisfaction with product, needs training for 3 new team members.',
ARRAY['training', 'team expansion', 'product satisfaction'],
'demo-user');

-- Add variety to contacts engagement
UPDATE public_contacts 
SET last_contacted = NOW() - INTERVAL '2 days',
    last_interaction_type = 'call',
    tags = ARRAY['high-value', 'decision-maker']
WHERE email = 'david.chen@smiledesigns.com';

UPDATE public_contacts 
SET last_contacted = NOW() - INTERVAL '5 days',
    last_interaction_type = 'meeting',
    tags = ARRAY['vip', 'aesthetic-focus', 'high-volume']
WHERE email = 'sarah.martinez@aestheticmed.com';