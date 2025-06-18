-- Populate Public Tables with Mock Data
-- This script inserts realistic demo data into all public tables

-- 1. Insert public_practices (20 practices - mix of dental and aesthetic)
INSERT INTO public_practices (id, name, address, city, state, zip, phone, email, website, type, size, patient_volume, annual_revenue, procedures, technologies, specialties, notes, status) VALUES
-- Dental Practices
('11111111-1111-1111-1111-111111111111', 'NYC Dental Implants Center', '425 Madison Ave', 'New York', 'NY', '10017', '212-555-1234', 'info@nycimplants.com', 'https://nycimplants.com', 'dental', 'large', 3500, 4800000, 
ARRAY['Dental Implants', 'Bone Grafting', 'Sinus Lifts', 'Full Mouth Reconstruction'], 
ARRAY['3D Imaging', 'CAD/CAM', 'Laser Dentistry', 'Digital Impressions'], 
ARRAY['Implantology', 'Oral Surgery', 'Periodontics'],
'Premier implant center in Manhattan. High-volume practice with latest technology.', 'active'),

('22222222-2222-2222-2222-222222222222', 'Columbia Dental Implant Center', '630 W 168th St', 'New York', 'NY', '10032', '212-305-7676', 'info@columbiadental.edu', 'https://columbiadental.edu', 'dental', 'large', 2800, 3200000,
ARRAY['Dental Implants', 'Teaching Programs', 'Research Studies', 'Complex Cases'],
ARRAY['Cone Beam CT', 'Surgical Guides', 'Piezo Surgery', 'PRF Technology'],
ARRAY['Academic Dentistry', 'Implantology', 'Research'],
'Academic center with residency program. Conducts clinical research and education.', 'active'),

('33333333-3333-3333-3333-333333333333', 'Midtown Periodontics', '555 5th Ave', 'New York', 'NY', '10017', '212-777-5432', 'info@midtownperio.com', 'https://midtownperio.com', 'dental', 'medium', 1800, 2100000,
ARRAY['Gum Grafting', 'LANAP Laser', 'Dental Implants', 'Bone Regeneration'],
ARRAY['Laser Dentistry', 'Microscope Surgery', 'Digital X-rays', 'Intraoral Cameras'],
ARRAY['Periodontics', 'Implantology', 'Regenerative Procedures'],
'Specialized periodontal practice focusing on minimally invasive techniques.', 'active'),

('44444444-4444-4444-4444-444444444444', 'Brooklyn Orthodontics', '789 Atlantic Ave', 'Brooklyn', 'NY', '11217', '718-555-2345', 'smile@brooklynortho.com', 'https://brooklynortho.com', 'dental', 'medium', 2200, 1800000,
ARRAY['Invisalign', 'Traditional Braces', 'Clear Aligners', 'Retainers'],
ARRAY['iTero Scanner', 'Digital Treatment Planning', '3D Printing', 'AI Smile Design'],
ARRAY['Orthodontics', 'Clear Aligner Therapy', 'Pediatric Orthodontics'],
'Modern orthodontic practice specializing in invisible aligners.', 'active'),

('55555555-5555-5555-5555-555555555555', 'Queens Endodontic Specialists', '456 Northern Blvd', 'Queens', 'NY', '11354', '718-444-3456', 'info@queensendo.com', 'https://queensendo.com', 'dental', 'small', 900, 1200000,
ARRAY['Root Canal Therapy', 'Retreatments', 'Apicoectomy', 'Trauma Care'],
ARRAY['Dental Microscope', 'Cone Beam CT', 'Apex Locators', 'Rotary Files'],
ARRAY['Endodontics', 'Microsurgery', 'Dental Trauma'],
'Boutique endodontic practice with advanced microscope technology.', 'active'),

-- Aesthetic Practices
('66666666-6666-6666-6666-666666666666', 'Manhattan Aesthetics', '740 Park Ave', 'New York', 'NY', '10021', '212-777-8899', 'info@manhattanaesthetics.com', 'https://manhattanaesthetics.com', 'aesthetic', 'large', 4200, 6500000,
ARRAY['Botox', 'Dermal Fillers', 'Sculptra', 'PDO Threads', 'PRP Therapy'],
ARRAY['Ultherapy', 'CoolSculpting', 'Morpheus8', 'IPL', 'Clear + Brilliant'],
ARRAY['Facial Rejuvenation', 'Body Contouring', 'Regenerative Medicine'],
'Luxury medical spa on the Upper East Side. Celebrity clientele.', 'active'),

('77777777-7777-7777-7777-777777777777', 'NY Laser Dermatology', '890 5th Ave', 'New York', 'NY', '10021', '212-333-4567', 'info@nylaserderm.com', 'https://nylaserderm.com', 'aesthetic', 'large', 3800, 5200000,
ARRAY['Laser Resurfacing', 'IPL Photofacial', 'Tattoo Removal', 'Vein Treatment'],
ARRAY['Fraxel', 'PicoSure', 'Vbeam', 'Excel V', 'Clear + Brilliant'],
ARRAY['Laser Dermatology', 'Cosmetic Dermatology', 'Vein Treatment'],
'High-tech dermatology center with latest laser technology.', 'active'),

('88888888-8888-8888-8888-888888888888', 'SoHo Aesthetics', '123 Spring St', 'New York', 'NY', '10012', '212-666-7890', 'hello@sohoaesthetics.com', 'https://sohoaesthetics.com', 'aesthetic', 'medium', 2400, 3100000,
ARRAY['Injectables', 'Thread Lifts', 'Microneedling', 'Chemical Peels'],
ARRAY['RF Microneedling', 'Hydrafacial', 'LED Therapy', 'Dermapen'],
ARRAY['Non-Surgical Rejuvenation', 'Facial Aesthetics', 'Skin Health'],
'Trendy aesthetic clinic in SoHo specializing in natural results.', 'active'),

('99999999-9999-9999-9999-999999999999', 'Tribeca Skin Center', '77 Worth St', 'New York', 'NY', '10013', '212-999-0123', 'info@tribecaskin.com', 'https://tribecaskin.com', 'aesthetic', 'medium', 2100, 2800000,
ARRAY['Chemical Peels', 'Microneedling', 'Laser Hair Removal', 'Acne Treatment'],
ARRAY['Picoway', 'Emsculpt NEO', 'Exilis Ultra', 'DiamondGlow'],
ARRAY['Medical Skincare', 'Acne Treatment', 'Anti-Aging'],
'Medical spa focusing on skin health and corrective treatments.', 'active'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Chelsea Medical Spa', '345 W 23rd St', 'New York', 'NY', '10011', '212-333-2345', 'info@chelseamedspa.com', 'https://chelseamedspa.com', 'aesthetic', 'large', 3200, 4100000,
ARRAY['Body Contouring', 'Cellulite Treatment', 'Skin Tightening', 'Fat Reduction'],
ARRAY['CoolSculpting Elite', 'Emsculpt NEO', 'Exilis', 'VelaShape'],
ARRAY['Body Contouring', 'Non-Invasive Fat Reduction', 'Muscle Building'],
'High-volume medical spa specializing in body treatments.', 'active');

-- 2. Insert public_call_analysis (15 call records)
INSERT INTO public_call_analysis (id, title, call_date, duration, contact_id, practice_id, summary, sentiment_score, key_topics, buying_signals, objections, action_items, next_steps) VALUES
('c1111111-1111-1111-1111-111111111111', 'Implant System Discussion - Dr. Johnson', NOW() - INTERVAL '2 days', 1823, 
(SELECT id FROM public_contacts WHERE last_name = 'Johnson' LIMIT 1), '11111111-1111-1111-1111-111111111111',
'Discussed Straumann BLX implant system features and pricing. Dr. Johnson interested in upgrading current system.',
0.72, ARRAY['implant systems', 'digital workflow', 'pricing', 'training'],
ARRAY['asked about pricing', 'requested demo', 'mentioned timeline'],
ARRAY['budget constraints', 'need partner approval'],
ARRAY['send pricing proposal', 'schedule demo', 'provide ROI analysis'],
ARRAY['follow up in 3 days', 'demo scheduled for next week']),

('c2222222-2222-2222-2222-222222222222', 'Academic Partnership - Dr. Chang', NOW() - INTERVAL '5 days', 2456,
(SELECT id FROM public_contacts WHERE last_name = 'Chang' LIMIT 1), '22222222-2222-2222-2222-222222222222',
'Explored educational partnership opportunities and bulk pricing for residency program.',
0.85, ARRAY['education', 'bulk pricing', 'residency program', 'hands-on training'],
ARRAY['expressed strong interest', 'asked about volume discounts', 'wants exclusive training'],
ARRAY['approval process lengthy'],
ARRAY['prepare educational proposal', 'outline training curriculum', 'draft partnership agreement'],
ARRAY['meeting with department heads', 'formal proposal presentation']),

('c3333333-3333-3333-3333-333333333333', 'Laser Technology Upgrade - Dr. Wong', NOW() - INTERVAL '7 days', 1234,
(SELECT id FROM public_contacts WHERE last_name = 'Wong' LIMIT 1), '33333333-3333-3333-3333-333333333333',
'Dr. Wong interested in LANAP laser upgrade for periodontal procedures.',
0.68, ARRAY['laser technology', 'LANAP', 'financing options', 'clinical outcomes'],
ARRAY['comparing to competitors', 'asked about warranty', 'discussed payment terms'],
ARRAY['price higher than expected'],
ARRAY['provide comparison chart', 'share clinical studies', 'explore financing'],
ARRAY['send literature', 'check back next week']),

('c4444444-4444-4444-4444-444444444444', 'Botox Training Inquiry - Jennifer Smith', NOW() - INTERVAL '1 day', 987,
(SELECT id FROM public_contacts WHERE last_name = 'Smith' AND first_name = 'Jennifer' LIMIT 1), '66666666-6666-6666-6666-666666666666',
'Lead injector seeking advanced Botox training and certification options.',
0.91, ARRAY['training', 'certification', 'advanced techniques', 'hands-on practice'],
ARRAY['ready to enroll', 'asked about dates', 'wants certification'],
ARRAY['schedule conflicts'],
ARRAY['send training calendar', 'reserve spot', 'process payment'],
ARRAY['enrollment this week', 'training next month']),

('c5555555-5555-5555-5555-555555555555', 'Laser Purchase Decision - Dr. Reynolds', NOW() - INTERVAL '3 days', 2103,
(SELECT id FROM public_contacts WHERE last_name = 'Reynolds' LIMIT 1), '77777777-7777-7777-7777-777777777777',
'Final decision meeting for PicoSure laser system purchase.',
0.88, ARRAY['laser purchase', 'financing', 'installation', 'training package'],
ARRAY['verbal commitment', 'discussing logistics', 'asked about delivery'],
ARRAY['none'],
ARRAY['finalize paperwork', 'schedule installation', 'arrange training'],
ARRAY['contract signing tomorrow', 'installation in 2 weeks']);

-- 3. Insert public_linguistics_analysis
INSERT INTO public_linguistics_analysis (id, call_id, analysis_date, sentiment_score, key_phrases, summary) VALUES
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', 0.72,
ARRAY['definitely interested', 'budget is tight', 'need to see ROI', 'love the technology'],
'Positive sentiment with budget concerns. High engagement and technical interest.'),

('a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days', 0.85,
ARRAY['this is exactly what we need', 'residents will love this', 'lets move forward', 'very excited'],
'Very positive sentiment. Strong buying signals and enthusiasm for partnership.'),

('a3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '7 days', 0.68,
ARRAY['interesting technology', 'need to compare options', 'price is concerning', 'clinical data looks good'],
'Cautiously positive. Price sensitivity detected but interested in clinical benefits.'),

('a4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '1 day', 0.91,
ARRAY['cant wait to start', 'this will help my practice', 'when can I begin', 'perfect timing'],
'Extremely positive sentiment. Ready to commit with high enthusiasm.'),

('a5555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '3 days', 0.88,
ARRAY['lets do this', 'financing approved', 'excited to get started', 'thank you for your help'],
'Very positive closing call. Deal confirmed with strong satisfaction.');

-- Update call_analysis with linguistics IDs
UPDATE public_call_analysis SET linguistics_analysis_id = 'a1111111-1111-1111-1111-111111111111' WHERE id = 'c1111111-1111-1111-1111-111111111111';
UPDATE public_call_analysis SET linguistics_analysis_id = 'a2222222-2222-2222-2222-222222222222' WHERE id = 'c2222222-2222-2222-2222-222222222222';
UPDATE public_call_analysis SET linguistics_analysis_id = 'a3333333-3333-3333-3333-333333333333' WHERE id = 'c3333333-3333-3333-3333-333333333333';
UPDATE public_call_analysis SET linguistics_analysis_id = 'a4444444-4444-4444-4444-444444444444' WHERE id = 'c4444444-4444-4444-4444-444444444444';
UPDATE public_call_analysis SET linguistics_analysis_id = 'a5555555-5555-5555-5555-555555555555' WHERE id = 'c5555555-5555-5555-5555-555555555555';

-- 4. Insert public_sales_activities
INSERT INTO public_sales_activities (contact_id, type, date, duration, notes, outcome) VALUES
((SELECT id FROM public_contacts WHERE last_name = 'Johnson' LIMIT 1), 'call', NOW() - INTERVAL '2 days', 30, 
'Initial implant system discussion. Very engaged.', 'Positive - Demo scheduled'),
((SELECT id FROM public_contacts WHERE last_name = 'Chang' LIMIT 1), 'meeting', NOW() - INTERVAL '5 days', 60,
'Academic partnership presentation to department.', 'Very Positive - Moving to contract'),
((SELECT id FROM public_contacts WHERE last_name = 'Wong' LIMIT 1), 'email', NOW() - INTERVAL '6 days', NULL,
'Sent LANAP clinical studies and pricing info.', 'Pending response'),
((SELECT id FROM public_contacts WHERE last_name = 'Smith' AND first_name = 'Jennifer' LIMIT 1), 'call', NOW() - INTERVAL '1 day', 15,
'Training enrollment discussion.', 'Closed - Enrolled in program'),
((SELECT id FROM public_contacts WHERE last_name = 'Reynolds' LIMIT 1), 'meeting', NOW() - INTERVAL '3 days', 45,
'Final negotiation and contract review.', 'Closed Won - $125,000');

-- 5. Insert public_research_projects
INSERT INTO public_research_projects (id, title, description, status, tags, priority, progress) VALUES
('b1111111-1111-1111-1111-111111111111', 'NYC Dental Implant Market Analysis', 
'Comprehensive analysis of implant adoption rates and competitive landscape in NYC metro area.', 
'active', ARRAY['dental', 'implants', 'market research'], 4, 75),

('b2222222-2222-2222-2222-222222222222', 'Aesthetic Injectable Trends 2025',
'Research on emerging trends in facial injectables and patient preferences.',
'active', ARRAY['aesthetic', 'injectables', 'trends'], 5, 45),

('b3333333-3333-3333-3333-333333333333', 'DSO Acquisition Strategy Report',
'Analysis of dental service organization consolidation opportunities.',
'completed', ARRAY['dental', 'DSO', 'M&A'], 3, 100);

-- 6. Insert public_research_documents
INSERT INTO public_research_documents (project_id, title, content, document_type, is_ai_generated, tags) VALUES
('b1111111-1111-1111-1111-111111111111', 'Executive Summary - NYC Implant Market',
'The NYC dental implant market shows 18% YoY growth with increasing adoption of digital workflows. Key players include Straumann, Nobel Biocare, and Zimmer Biomet. Opportunity exists in practices transitioning from analog to digital implant planning.',
'summary', true, ARRAY['executive summary', 'key findings']),

('b2222222-2222-2222-2222-222222222222', 'Patient Survey Results - Injectable Preferences',
'Survey of 500 patients reveals 73% prefer combination treatments, 82% value natural results over dramatic changes, and 91% research providers extensively online before booking. Price sensitivity decreasing for premium products.',
'analysis', false, ARRAY['survey', 'patient insights']),

('b3333333-3333-3333-3333-333333333333', 'DSO Target List and Valuations',
'Identified 15 potential acquisition targets in tri-state area. Average EBITDA multiples ranging from 5-8x. Strong consolidation opportunity in multi-location practices with 3-10 locations.',
'report', true, ARRAY['targets', 'valuations']);

-- 7. Insert public_companies
INSERT INTO public_companies (name, website, industry, headquarters, description, products, market_share, annual_revenue) VALUES
('Straumann Group', 'https://www.straumann.com', 'dental', 'Basel, Switzerland',
'Global leader in implant dentistry and orthodontic solutions.',
ARRAY['BLX Implants', 'ClearCorrect', 'Biomaterials', 'Digital Solutions'], 24.5, 2100000000),

('Allergan Aesthetics', 'https://www.allerganaesthetics.com', 'aesthetic', 'Irvine, CA',
'Leading provider of facial aesthetics and body contouring solutions.',
ARRAY['Botox', 'Juvederm', 'CoolSculpting', 'Natrelle'], 31.2, 3800000000),

('Cutera', 'https://www.cutera.com', 'aesthetic', 'Brisbane, CA',
'Innovative leader in energy-based aesthetic systems.',
ARRAY['Secret RF', 'Enlighten', 'Excel V+', 'TruSculpt'], 8.4, 285000000);

-- 8. Insert public_procedures
INSERT INTO public_procedures (name, category, subcategory, description, avg_cost_min, avg_cost_max, avg_duration, recovery_time, popularity_score, key_benefits) VALUES
('Dental Implant Placement', 'dental', 'Oral Surgery',
'Surgical placement of titanium implant to replace missing tooth root.',
3000, 6000, 90, '3-6 months', 9,
ARRAY['Permanent solution', 'Preserves bone', 'Natural appearance']),

('Botox Injection', 'aesthetic', 'Injectables',
'Neurotoxin injection to reduce dynamic wrinkles and fine lines.',
300, 800, 15, 'None', 10,
ARRAY['Quick results', 'No downtime', 'Preventative aging']),

('CoolSculpting', 'aesthetic', 'Body Contouring',
'Non-invasive fat reduction using controlled cooling technology.',
2000, 4000, 60, '0-2 days', 8,
ARRAY['Non-surgical', 'FDA cleared', 'Permanent fat reduction']),

('All-on-4 Dental Implants', 'dental', 'Full Mouth Restoration',
'Full arch restoration using four strategically placed implants.',
20000, 40000, 180, '3-6 months', 7,
ARRAY['Same-day teeth', 'Bone preservation', 'Fixed solution']),

('Morpheus8', 'aesthetic', 'Skin Tightening',
'Radiofrequency microneedling for skin remodeling and tightening.',
1200, 3000, 45, '3-5 days', 9,
ARRAY['Collagen stimulation', 'Minimal downtime', 'Long-lasting results']);