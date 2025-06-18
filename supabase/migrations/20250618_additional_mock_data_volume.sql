-- Additional Mock Data for Better Demo Experience
-- This adds more volume to public tables for realistic demonstration

-- Add 10 more practices (mix of dental and aesthetic across different cities)
INSERT INTO public_practices (name, address, city, state, zip, phone, email, website, type, size, patient_volume, annual_revenue, procedures, technologies, specialties, notes, status) VALUES
-- Additional Dental Practices
('Beverly Hills Dental Excellence', '9701 Wilshire Blvd', 'Beverly Hills', 'CA', '90212', '310-555-8900', 'info@bhdental.com', 'https://bhdental.com', 'dental', 'large', 4200, 5600000,
ARRAY['Cosmetic Dentistry', 'Veneers', 'Smile Makeovers', 'Teeth Whitening'],
ARRAY['CEREC Same-Day Crowns', 'Digital Smile Design', 'Laser Dentistry', 'Intraoral Scanners'],
ARRAY['Cosmetic Dentistry', 'Prosthodontics', 'General Dentistry'],
'High-end cosmetic practice serving celebrities and executives.', 'active'),

('Chicago Implant Institute', '401 N Michigan Ave', 'Chicago', 'IL', '60611', '312-555-7800', 'info@chicagoimplants.com', 'https://chicagoimplants.com', 'dental', 'medium', 2400, 3200000,
ARRAY['All-on-4', 'Zygomatic Implants', 'Bone Grafting', 'Sinus Lifts'],
ARRAY['Nobel Biocare System', 'Cone Beam CT', 'Piezosurgery', 'PRF'],
ARRAY['Implantology', 'Oral Surgery', 'Prosthodontics'],
'Specialized implant center with focus on complex cases.', 'active'),

('Miami Beach Orthodontics', '1560 Collins Ave', 'Miami Beach', 'FL', '33139', '305-555-4567', 'info@miamiortho.com', 'https://miamiortho.com', 'dental', 'medium', 1900, 2400000,
ARRAY['Invisalign', 'Lingual Braces', 'Accelerated Orthodontics', 'Clear Aligners'],
ARRAY['iTero Element Scanner', '3D Treatment Planning', 'Digital Monitoring', 'AI Smile Prediction'],
ARRAY['Orthodontics', 'Clear Aligner Therapy', 'Adult Orthodontics'],
'Trendy orthodontic practice popular with young professionals.', 'active'),

('Seattle Periodontal Associates', '1201 3rd Ave', 'Seattle', 'WA', '98101', '206-555-3456', 'info@seattleperio.com', 'https://seattleperio.com', 'dental', 'small', 1100, 1600000,
ARRAY['LANAP Laser Therapy', 'Gum Grafting', 'Crown Lengthening', 'Ridge Augmentation'],
ARRAY['PerioLase MVP-7', 'Dental Microscope', 'Piezo Ultrasonic', 'Digital Radiography'],
ARRAY['Periodontics', 'Laser Therapy', 'Regenerative Procedures'],
'Boutique periodontal practice with emphasis on minimally invasive treatments.', 'active'),

('Dallas Family Dental Group', '2001 Bryan St', 'Dallas', 'TX', '75201', '214-555-6789', 'info@dallasfamilydental.com', 'https://dallasfamilydental.com', 'dental', 'large', 3800, 4200000,
ARRAY['General Dentistry', 'Pediatric Care', 'Emergency Services', 'Preventive Care'],
ARRAY['Digital X-rays', 'Intraoral Cameras', 'Cavity Detection System', 'Soft Tissue Lasers'],
ARRAY['Family Dentistry', 'Pediatric Dentistry', 'General Practice'],
'Multi-location family practice with Saturday hours.', 'active'),

-- Additional Aesthetic Practices
('Beverly Hills Plastic Surgery', '436 N Bedford Dr', 'Beverly Hills', 'CA', '90210', '310-555-1234', 'info@bhplasticsurgery.com', 'https://bhplasticsurgery.com', 'aesthetic', 'large', 3600, 8200000,
ARRAY['Facelift', 'Rhinoplasty', 'Breast Augmentation', 'Liposuction'],
ARRAY['Vectra 3D Imaging', 'Plasma Technology', 'Advanced Monitoring', 'VR Consultation'],
ARRAY['Plastic Surgery', 'Facial Surgery', 'Body Contouring'],
'World-renowned plastic surgery center with international clientele.', 'active'),

('Chicago Aesthetic Medicine', '900 N Michigan Ave', 'Chicago', 'IL', '60611', '312-555-9012', 'info@chicagoaesthetics.com', 'https://chicagoaesthetics.com', 'aesthetic', 'medium', 2800, 3900000,
ARRAY['Injectables', 'PDO Threads', 'PRP Treatments', 'Skin Resurfacing'],
ARRAY['Ultherapy', 'Thermage', 'Clear + Brilliant', 'Hydrafacial MD'],
ARRAY['Non-Surgical Aesthetics', 'Regenerative Medicine', 'Facial Rejuvenation'],
'Modern aesthetic clinic in the Magnificent Mile.', 'active'),

('Miami Laser & Skin Institute', '3000 NE 1st Ave', 'Miami', 'FL', '33137', '305-555-7890', 'info@miamilaser.com', 'https://miamilaser.com', 'aesthetic', 'large', 4100, 5400000,
ARRAY['Laser Hair Removal', 'Tattoo Removal', 'Skin Tightening', 'Acne Scar Treatment'],
ARRAY['PicoWay', 'Fraxel Dual', 'Thermage FLX', 'Emsculpt NEO'],
ARRAY['Laser Medicine', 'Skin Resurfacing', 'Body Sculpting'],
'High-tech laser center serving diverse Miami population.', 'active'),

('Seattle Dermatology & Cosmetics', '1100 9th Ave', 'Seattle', 'WA', '98101', '206-555-4321', 'info@seattlederm.com', 'https://seattlederm.com', 'aesthetic', 'medium', 2200, 3100000,
ARRAY['Medical Dermatology', 'Cosmetic Procedures', 'Skin Cancer Screening', 'Acne Treatment'],
ARRAY['Mohs Surgery Equipment', 'Excimer Laser', 'Photodynamic Therapy', 'Dermoscopy'],
ARRAY['Dermatology', 'Mohs Surgery', 'Cosmetic Dermatology'],
'Comprehensive dermatology practice with medical and cosmetic services.', 'active'),

('Dallas Med Spa & Wellness', '3102 Maple Ave', 'Dallas', 'TX', '75201', '214-555-5678', 'info@dallasmedspa.com', 'https://dallasmedspa.com', 'aesthetic', 'large', 3400, 4600000,
ARRAY['Body Contouring', 'Hormone Therapy', 'IV Therapy', 'Medical Weight Loss'],
ARRAY['CoolSculpting Elite', 'Vanquish ME', 'Kybella', 'Body FX'],
ARRAY['Wellness Medicine', 'Body Contouring', 'Hormone Optimization'],
'Integrated wellness and aesthetic center with holistic approach.', 'active');

-- Add 20 more call analysis records with varied sentiment and outcomes
INSERT INTO public_call_analysis (title, call_date, duration, contact_id, practice_id, summary, sentiment_score, key_topics, buying_signals, objections, action_items, next_steps) VALUES
('Product Demo Follow-up - Dr. Patel', NOW() - INTERVAL '4 days', 1567,
(SELECT id FROM public_contacts WHERE last_name = 'Patel' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%NYC Smiles%' LIMIT 1),
'Follow-up after digital workflow demo. Very impressed with efficiency gains.',
0.82, ARRAY['digital workflow', 'time savings', 'ROI', 'staff training'],
ARRAY['loved the demo', 'checking with partners', 'budget approved'],
ARRAY['implementation timeline'],
ARRAY['provide implementation plan', 'schedule training dates'],
ARRAY['decision by Friday', 'start next month']),

('Cold Call - New Practice Opening', NOW() - INTERVAL '10 days', 743,
(SELECT id FROM public_contacts WHERE last_name = 'Wilson' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Manhattan Dental%' LIMIT 1),
'Initial contact about equipment needs for second location.',
0.65, ARRAY['new location', 'equipment packages', 'bulk pricing'],
ARRAY['opening in 3 months', 'need everything'],
ARRAY['evaluating multiple vendors'],
ARRAY['send comprehensive proposal', 'include package deals'],
ARRAY['proposal review next week']),

('Competitive Situation - Dr. Brown', NOW() - INTERVAL '6 days', 2234,
(SELECT id FROM public_contacts WHERE last_name = 'Brown' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Upper East Side%' LIMIT 1),
'Discussing switch from competitor. Unhappy with current service.',
0.78, ARRAY['service issues', 'switching costs', 'product comparison'],
ARRAY['frustrated with current vendor', 'ready to switch'],
ARRAY['contract termination fees'],
ARRAY['review competitor contract', 'calculate switching ROI'],
ARRAY['legal review this week']),

('Upsell Opportunity - Dr. Chen', NOW() - INTERVAL '8 days', 1890,
(SELECT id FROM public_contacts WHERE last_name = 'Chen' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%SoHo%' LIMIT 1),
'Expanding services, needs additional equipment.',
0.91, ARRAY['service expansion', 'new treatments', 'package upgrade'],
ARRAY['business is growing', 'need more capacity'],
ARRAY['none'],
ARRAY['customize expansion package', 'expedite delivery'],
ARRAY['order this week', 'install by month end']),

('Price Negotiation - Dr. Garcia', NOW() - INTERVAL '12 days', 2567,
(SELECT id FROM public_contacts WHERE last_name = 'Garcia' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%NYC Plastic%' LIMIT 1),
'Final pricing discussion for large equipment order.',
0.71, ARRAY['volume discount', 'payment terms', 'warranty extension'],
ARRAY['ready to buy', 'need better price'],
ARRAY['competitor offering 15% less'],
ARRAY['get pricing approval', 'match competitor', 'add value'],
ARRAY['revised proposal tomorrow']),

('Technical Support Follow-up', NOW() - INTERVAL '15 days', 456,
(SELECT id FROM public_contacts WHERE last_name = 'Lee' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Chelsea%' LIMIT 1),
'Checking satisfaction after technical issue resolution.',
0.88, ARRAY['support quality', 'response time', 'issue resolution'],
ARRAY['very satisfied', 'impressed with support'],
ARRAY['none'],
ARRAY['document case study', 'request testimonial'],
ARRAY['testimonial next week']),

('Contract Renewal Discussion', NOW() - INTERVAL '20 days', 1789,
(SELECT id FROM public_contacts WHERE last_name = 'Martinez' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Bronx%' LIMIT 1),
'Annual contract renewal with service upgrade options.',
0.75, ARRAY['renewal terms', 'service upgrades', 'loyalty discount'],
ARRAY['happy with service', 'considering upgrades'],
ARRAY['budget tighter this year'],
ARRAY['offer payment plan', 'include loyalty discount'],
ARRAY['renewal by month end']),

('New Technology Introduction', NOW() - INTERVAL '9 days', 1234,
(SELECT id FROM public_contacts WHERE last_name = 'Taylor' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Staten Island%' LIMIT 1),
'Introducing new laser system to existing client.',
0.84, ARRAY['new technology', 'clinical benefits', 'upgrade path'],
ARRAY['very interested', 'wants to stay current'],
ARRAY['just bought other equipment'],
ARRAY['explore trade-in options', 'flexible payment'],
ARRAY['demo in two weeks']),

('Referral Partner Check-in', NOW() - INTERVAL '11 days', 923,
(SELECT id FROM public_contacts WHERE last_name = 'Kim' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Queens%' LIMIT 1),
'Quarterly check-in with key referral source.',
0.92, ARRAY['referrals', 'partnership benefits', 'co-marketing'],
ARRAY['sending more referrals', 'wants deeper partnership'],
ARRAY['none'],
ARRAY['formalize referral program', 'plan joint event'],
ARRAY['partnership agreement draft']),

('Emergency Purchase Need', NOW() - INTERVAL '1 day', 678,
(SELECT id FROM public_contacts WHERE last_name = 'Rodriguez' LIMIT 1),
(SELECT id FROM public_practices WHERE name LIKE '%Brooklyn Ortho%' LIMIT 1),
'Equipment failure, needs immediate replacement.',
0.95, ARRAY['emergency order', 'expedited shipping', 'installation'],
ARRAY['need it ASAP', 'price not primary concern'],
ARRAY['none'],
ARRAY['check inventory', 'arrange rush delivery'],
ARRAY['delivery tomorrow', 'install same day']);

-- Add 30 more sales activities for better activity tracking
INSERT INTO public_sales_activities (contact_id, type, date, duration, notes, outcome) VALUES
-- Email campaigns
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'email', NOW() - INTERVAL '1 day', NULL,
'New product announcement email', 'Opened - No response yet'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'email', NOW() - INTERVAL '2 days', NULL,
'Follow-up on quote request', 'Replied - Scheduling call'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'email', NOW() - INTERVAL '3 days', NULL,
'Monthly newsletter', 'Clicked through to website'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'email', NOW() - INTERVAL '4 days', NULL,
'Webinar invitation', 'Registered for event'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'email', NOW() - INTERVAL '5 days', NULL,
'Case study share', 'Forwarded to colleagues'),

-- Phone calls
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'call', NOW() - INTERVAL '1 day', 15,
'Quick check-in call', 'Left voicemail'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'call', NOW() - INTERVAL '2 days', 45,
'Product consultation', 'Detailed discussion - Follow up needed'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'call', NOW() - INTERVAL '3 days', 30,
'Technical support call', 'Issue resolved'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'call', NOW() - INTERVAL '4 days', 20,
'Renewal reminder', 'Will renew next month'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'call', NOW() - INTERVAL '5 days', 60,
'Negotiation call', 'Agreed on terms'),

-- Meetings
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'meeting', NOW() - INTERVAL '2 days', 90,
'Quarterly business review', 'Very positive - Upsell opportunity'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'meeting', NOW() - INTERVAL '4 days', 60,
'Product demonstration', 'Well received - Decision pending'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'meeting', NOW() - INTERVAL '6 days', 120,
'Contract negotiation', 'Terms agreed - Legal review'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'meeting', NOW() - INTERVAL '8 days', 45,
'Lunch meeting', 'Relationship building - Good rapport'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'meeting', NOW() - INTERVAL '10 days', 75,
'Training session', 'Successful - Team engaged'),

-- Notes
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'note', NOW() - INTERVAL '1 day', NULL,
'Competitor moved into their building', 'Monitor situation'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'note', NOW() - INTERVAL '2 days', NULL,
'Expanding to second location in Q2', 'Big opportunity'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'note', NOW() - INTERVAL '3 days', NULL,
'Budget approved for new equipment', 'Follow up immediately'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'note', NOW() - INTERVAL '4 days', NULL,
'Key contact retiring next month', 'Meet replacement'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'note', NOW() - INTERVAL '5 days', NULL,
'Mentioned issues with current vendor', 'Opportunity to switch'),

-- Tasks
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'task', NOW() + INTERVAL '1 day', NULL,
'Send updated pricing catalog', 'Scheduled'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'task', NOW() + INTERVAL '2 days', NULL,
'Follow up on demo request', 'Pending'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'task', NOW() + INTERVAL '3 days', NULL,
'Prepare custom proposal', 'In progress'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'task', NOW() + INTERVAL '4 days', NULL,
'Schedule quarterly review', 'Pending'),
((SELECT id FROM public_contacts ORDER BY RANDOM() LIMIT 1), 'task', NOW() + INTERVAL '5 days', NULL,
'Research competitor pricing', 'Not started');

-- Add more research data
INSERT INTO public_research_projects (title, description, status, tags, priority, progress) VALUES
('Competitive Analysis - Laser Systems', 
'Comprehensive comparison of laser systems in aesthetic market with pricing and features.',
'active', ARRAY['competitive', 'laser', 'pricing'], 5, 60),

('Patient Financing Trends Study',
'Analysis of patient financing options and their impact on case acceptance rates.',
'active', ARRAY['financing', 'patient experience', 'conversion'], 4, 30),

('Telemedicine Integration Opportunities',
'Research on telemedicine adoption in aesthetic consultations post-COVID.',
'completed', ARRAY['telemedicine', 'technology', 'trends'], 3, 100),

('Regional Market Penetration Analysis',
'Deep dive into market share by region with growth opportunities.',
'active', ARRAY['market analysis', 'regional', 'growth'], 5, 85);

-- Add corresponding research documents
INSERT INTO public_research_documents (project_id, title, content, document_type, is_ai_generated, tags) VALUES
((SELECT id FROM public_research_projects WHERE title LIKE '%Competitive Analysis%' LIMIT 1),
'Laser System Comparison Matrix',
'Detailed comparison of top 10 laser systems including Cutera, Candela, Lumenis, and others. Price ranges from $45K-$250K with varying capabilities. Cutera Secret RF leads in versatility, while Candela PicoWay excels in tattoo removal.',
'analysis', true, ARRAY['comparison', 'specifications']),

((SELECT id FROM public_research_projects WHERE title LIKE '%Patient Financing%' LIMIT 1),
'Financing Options Impact Report',
'Study shows 67% increase in case acceptance when financing is offered. CareCredit dominates with 45% market share, followed by Alphaeon at 23%. Practices offering in-house financing see 34% higher patient retention.',
'report', false, ARRAY['financing', 'statistics']),

((SELECT id FROM public_research_projects WHERE title LIKE '%Regional Market%' LIMIT 1),
'Q1 2025 Regional Performance Dashboard',
'Northeast leads revenue at $4.2M (32% of total), followed by West Coast at $3.8M (29%). Highest growth in Southeast at 23% YoY. Opportunity in Midwest with only 15% market penetration.',
'summary', true, ARRAY['quarterly results', 'regional data']);