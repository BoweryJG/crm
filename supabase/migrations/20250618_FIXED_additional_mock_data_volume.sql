-- Additional Mock Data for Better Demo Experience
-- FIXED VERSION - Matches actual table structures

-- Add 5 more practices (simplified to match actual structure)
INSERT INTO public_practices (id, name, address, city, state, zip, phone, email, website, type, size, status, patient_volume, annual_revenue) VALUES
('66666666-6666-6666-6666-666666666666', 'Boston Dental Group', '100 Federal St', 'Boston', 'MA', '02110', '617-555-0100', 'info@bostondental.com', 'https://bostondental.com', 'dental', 'large', 'active', 400, 3200000),
('77777777-7777-7777-7777-777777777777', 'Phoenix Aesthetic Center', '2000 E Camelback Rd', 'Phoenix', 'AZ', '85016', '602-555-0200', 'hello@phoenixaesthetic.com', 'https://phoenixaesthetic.com', 'aesthetic', 'medium', 'active', 250, 2100000),
('88888888-8888-8888-8888-888888888888', 'Seattle Smile Studio', '400 Pine St', 'Seattle', 'WA', '98101', '206-555-0300', 'contact@seattlesmile.com', 'https://seattlesmile.com', 'dental', 'medium', 'active', 280, 2000000),
('99999999-9999-9999-9999-999999999999', 'Austin Aesthetics', '600 Congress Ave', 'Austin', 'TX', '78701', '512-555-0400', 'info@austinaesthetics.com', 'https://austinaesthetics.com', 'aesthetic', 'small', 'active', 180, 1500000),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Denver Dental Arts', '1600 Broadway', 'Denver', 'CO', '80202', '303-555-0500', 'smile@denverdentalarts.com', 'https://denverdentalarts.com', 'dental', 'large', 'active', 350, 2800000);

-- Add 10 more call analysis records
INSERT INTO public_call_analysis (id, title, call_date, duration, contact_id, sentiment_score, transcript, summary, key_topics, objections, next_steps, user_id) VALUES
('c5555555-5555-5555-5555-555555555555', 'Product Demo Follow-up - Dr. Patel', NOW() - INTERVAL '4 days', 1567,
(SELECT id FROM public_contacts WHERE last_name = 'Patel' LIMIT 1), 0.82,
'Follow-up after digital workflow demo. Very impressed with efficiency gains.',
'Strong interest in digital workflow solution. Budget approved, checking with partners.',
ARRAY['digital workflow', 'time savings', 'ROI', 'staff training'],
ARRAY['implementation timeline'],
ARRAY['provide implementation plan', 'schedule training dates'],
'demo-user'),

('c6666666-6666-6666-6666-666666666666', 'Cold Call - New Practice', NOW() - INTERVAL '10 days', 743,
(SELECT id FROM public_contacts WHERE last_name = 'Wilson' LIMIT 1), 0.65,
'Initial contact about equipment needs for second location.',
'Opening new location in 3 months. Needs comprehensive equipment package.',
ARRAY['new location', 'equipment packages', 'bulk pricing'],
ARRAY['evaluating multiple vendors'],
ARRAY['send comprehensive proposal', 'include package deals'],
'demo-user'),

('c7777777-7777-7777-7777-777777777777', 'Competitive Situation', NOW() - INTERVAL '6 days', 2234,
(SELECT id FROM public_contacts WHERE last_name = 'Brown' LIMIT 1), 0.78,
'Discussing switch from competitor. Unhappy with current service.',
'Frustrated with current vendor service. Ready to switch but concerned about contract fees.',
ARRAY['service issues', 'switching costs', 'product comparison'],
ARRAY['contract termination fees'],
ARRAY['review competitor contract', 'calculate switching ROI'],
'demo-user'),

('c8888888-8888-8888-8888-888888888888', 'Upsell Opportunity', NOW() - INTERVAL '8 days', 1890,
(SELECT id FROM public_contacts WHERE email = 'david.chen@smiledesigns.com' LIMIT 1), 0.91,
'Expanding services, needs additional equipment.',
'Business growing rapidly. Ready to add new service line with equipment purchase.',
ARRAY['service expansion', 'new treatments', 'package upgrade'],
ARRAY['none'],
ARRAY['customize expansion package', 'expedite delivery'],
'demo-user'),

('c9999999-9999-9999-9999-999999999999', 'Price Negotiation', NOW() - INTERVAL '12 days', 2567,
(SELECT id FROM public_contacts WHERE last_name = 'Garcia' LIMIT 1), 0.71,
'Final pricing discussion for large equipment order.',
'Ready to purchase but competitor offering 15% less. Needs price match or added value.',
ARRAY['volume discount', 'payment terms', 'warranty extension'],
ARRAY['competitor offering 15% less'],
ARRAY['get pricing approval', 'match competitor'],
'demo-user');

-- Add more linguistics analyses for new calls
INSERT INTO public_linguistics_analysis (id, call_id, analysis_date, sentiment_score, key_phrases, summary) VALUES
('a3333333-3333-3333-3333-333333333333', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '4 days', 0.82,
ARRAY['very impressed', 'efficiency gains', 'budget approved', 'checking with partners'],
'Positive sentiment with strong buying signals. Decision pending partner approval.'),

('a4444444-4444-4444-4444-444444444444', 'c7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '6 days', 0.78,
ARRAY['unhappy with service', 'ready to switch', 'contract concerns', 'frustrated'],
'Mixed sentiment - dissatisfaction with competitor but worried about switching costs.');

-- Update call analyses with linguistics IDs
UPDATE public_call_analysis SET linguistics_analysis_id = 'a3333333-3333-3333-3333-333333333333' WHERE id = 'c5555555-5555-5555-5555-555555555555';
UPDATE public_call_analysis SET linguistics_analysis_id = 'a4444444-4444-4444-4444-444444444444' WHERE id = 'c7777777-7777-7777-7777-777777777777';

-- Add 15 more sales activities (simplified structure)
INSERT INTO public_sales_activities (id, user_id, contact_id, type, date, duration, notes, outcome) VALUES
('e4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Patel' LIMIT 1),
'email', NOW() - INTERVAL '5 days', NULL,
'Sent product brochure and pricing', 'successful'),

('e5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Wilson' LIMIT 1),
'call', NOW() - INTERVAL '11 days', 15,
'Initial cold call about new location', 'successful'),

('e6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Brown' LIMIT 1),
'meeting', NOW() - INTERVAL '7 days', 90,
'In-person meeting to discuss switching from competitor', 'follow_up_required'),

('e7777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Garcia' LIMIT 1),
'email', NOW() - INTERVAL '13 days', NULL,
'Initial outreach with company introduction', 'successful'),

('e8888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Lee' LIMIT 1),
'call', NOW() - INTERVAL '2 days', 20,
'Technical support follow-up call', 'successful'),

('e9999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Taylor' LIMIT 1),
'meeting', NOW() - INTERVAL '3 days', 60,
'Virtual product demonstration', 'successful'),

('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001',
(SELECT id FROM public_contacts WHERE last_name = 'Martinez' LIMIT 1),
'email', NOW() - INTERVAL '6 days', NULL,
'Contract renewal reminder', 'no_decision');

-- Add 3 more research projects
INSERT INTO public_research_projects (id, title, description, status, created_by, tags, priority, progress, user_id) VALUES
('b3333333-3333-3333-3333-333333333333', 'Competitive Analysis - Laser Systems', 
'Comprehensive comparison of laser systems in aesthetic market', 
'active', '00000000-0000-0000-0000-000000000001',
ARRAY['competitive', 'laser', 'pricing'],
3, 60, 'demo-user'),

('b4444444-4444-4444-4444-444444444444', 'Patient Financing Trends',
'Analysis of financing options and impact on case acceptance',
'completed', '00000000-0000-0000-0000-000000000001',
ARRAY['financing', 'patient experience'],
2, 100, 'demo-user'),

('b5555555-5555-5555-5555-555555555555', 'Regional Market Analysis',
'Market penetration by region with growth opportunities',
'active', '00000000-0000-0000-0000-000000000001',
ARRAY['market analysis', 'regional', 'growth'],
1, 85, 'demo-user');

-- Add research documents for new projects
INSERT INTO public_research_documents (id, project_id, title, content, document_type, created_by, tags) VALUES
('d3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333',
'Laser System Comparison Matrix',
'Detailed comparison of top 10 laser systems. Cutera leads in versatility, Candela excels in tattoo removal.',
'analysis', '00000000-0000-0000-0000-000000000001',
ARRAY['comparison', 'specifications']),

('d4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444',
'Financing Impact Report',
'67% increase in case acceptance when financing offered. CareCredit leads with 45% market share.',
'report', '00000000-0000-0000-0000-000000000001',
ARRAY['financing', 'statistics']);

-- Add 3 more companies
INSERT INTO public_companies (id, name, website, industry, headquarters, description, products, founded_year, market_share) VALUES
('c0333333-3333-3333-3333-333333333333', 'Cutera', 'https://www.cutera.com', 'aesthetic',
'Brisbane, CA', 'Leading provider of laser and energy-based aesthetic systems',
ARRAY['Secret RF', 'Excel V+', 'truSculpt', 'Enlighten', 'Xeo Platform'],
1998, 18.5),

('c0444444-4444-4444-4444-444444444444', 'Nobel Biocare', 'https://www.nobelbiocare.com', 'dental',
'Zurich, Switzerland', 'Pioneer in innovative implant-based dental restorations',
ARRAY['NobelActive', 'NobelParallel', 'All-on-4', 'X-Guide', 'DTX Studio'],
1981, 22.3),

('c0555555-5555-5555-5555-555555555555', 'Invisalign', 'https://www.invisalign.com', 'dental',
'San Jose, CA', 'Global leader in clear aligner therapy',
ARRAY['Invisalign Clear Aligners', 'iTero Scanner', 'SmileView', 'ClinCheck Software'],
1997, 45.2);

-- Add 3 more procedures
INSERT INTO public_procedures (id, name, category, subcategory, description, avg_cost_min, avg_cost_max, popularity_score) VALUES
('f3333333-3333-3333-3333-333333333333', 'Clear Aligner Therapy', 'dental', 'orthodontics',
'Custom clear aligners for teeth straightening without traditional braces',
3500, 8000, 9),

('f4444444-4444-4444-4444-444444444444', 'Dermal Fillers', 'aesthetic', 'injectables',
'Hyaluronic acid fillers for facial volume restoration and contouring',
600, 1200, 10),

('f5555555-5555-5555-5555-555555555555', 'Laser Hair Removal', 'aesthetic', 'laser treatments',
'Permanent hair reduction using advanced laser technology',
200, 500, 8);

-- Update some contacts with recent activity for realism
UPDATE public_contacts 
SET last_contacted = NOW() - INTERVAL '1 day',
    last_interaction_type = 'email',
    tags = ARRAY['active', 'high-potential']
WHERE email IN (
  SELECT email FROM public_contacts 
  WHERE last_contacted IS NULL 
  LIMIT 5
);

-- Add variety to contact statuses
UPDATE public_contacts
SET status = 'lead'
WHERE id IN (
  SELECT id FROM public_contacts 
  WHERE status = 'active' 
  ORDER BY RANDOM() 
  LIMIT 3
);

UPDATE public_contacts
SET status = 'prospect'
WHERE id IN (
  SELECT id FROM public_contacts 
  WHERE status = 'active' 
  ORDER BY RANDOM() 
  LIMIT 2
);