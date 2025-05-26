-- Add 20 more public contacts (10 dental + 10 aesthetic) to achieve 40 total contacts

-- Additional 10 Dental Professionals
INSERT INTO public_contacts (
  id, first_name, last_name, email, phone, title, type, status, 
  practice_name, decision_maker, influencer, purchaser, notes, 
  tags, created_by, assigned_to, is_starred
) VALUES
-- Additional Dental Contacts
(uuid_generate_v4(), 'Thomas', 'Anderson', 'tanderson@westvillagedental.com', '212-555-3456', 'General Dentist', 'dentist', 'active', 
 'West Village Dental Studio', TRUE, FALSE, TRUE, 'Focuses on cosmetic dentistry and veneers. Interested in digital smile design.',
 ARRAY['Cosmetic', 'Digital', 'Veneers'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Rachel', 'Green', 'rgreen@centralparkcosmeticdentistry.com', '212-444-5678', 'Cosmetic Dentist', 'dentist', 'active', 
 'Central Park Cosmetic Dentistry', TRUE, TRUE, FALSE, 'High-end practice focusing on celebrity clients. Uses latest technology.',
 ARRAY['Cosmetic', 'VIP', 'Technology'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Steven', 'Wu', 'swu@flushingdentalgroup.com', '718-888-2345', 'Oral Surgeon', 'oral_surgeon', 'active', 
 'Flushing Dental Group', FALSE, TRUE, TRUE, 'Multi-specialty group practice. High volume implant cases.',
 ARRAY['Implants', 'Group Practice', 'High Volume'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Monica', 'Geller', 'mgeller@tribecaperiodontics.com', '212-777-8901', 'Periodontist', 'periodontist', 'active', 
 'Tribeca Advanced Periodontics', TRUE, FALSE, TRUE, 'Specializes in LANAP and minimally invasive procedures.',
 ARRAY['LANAP', 'Laser', 'Minimally Invasive'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Christopher', 'Lee', 'clee@upperwestortho.com', '212-555-6789', 'Orthodontist', 'orthodontist', 'active', 
 'Upper West Side Orthodontics', TRUE, TRUE, TRUE, 'Invisalign Diamond Plus provider. Teen and adult orthodontics.',
 ARRAY['Invisalign', 'Diamond Plus', 'Adults'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Amanda', 'Chen', 'achen@greenwichendodontics.com', '212-999-3456', 'Endodontist', 'endodontist', 'active', 
 'Greenwich Village Endodontics', FALSE, TRUE, FALSE, 'Uses advanced microscopes and CBCT. Specializes in complex cases.',
 ARRAY['Microscope', 'CBCT', 'Complex Cases'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Ryan', 'Murphy', 'rmurphy@brooklynheightsprostho.com', '718-222-4567', 'Prosthodontist', 'prosthodontist', 'active', 
 'Brooklyn Heights Prosthodontics', TRUE, FALSE, TRUE, 'Full mouth rehabilitation specialist. Works with digital workflow.',
 ARRAY['Full Mouth', 'Digital', 'Rehabilitation'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Jessica', 'Park', 'jpark@astoriakidsdental.com', '718-333-5678', 'Pediatric Dentist', 'pediatric_dentist', 'active', 
 'Astoria Kids Dental Care', TRUE, TRUE, FALSE, 'Child-friendly practice with sedation options. Special needs certified.',
 ARRAY['Pediatric', 'Sedation', 'Special Needs'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Nathan', 'Scott', 'nscott@financialdistrictdental.com', '212-111-2345', 'General Dentist', 'dentist', 'active', 
 'Financial District Dental', TRUE, FALSE, TRUE, 'Corporate clientele. Offers same-day crowns and emergency services.',
 ARRAY['Corporate', 'CEREC', 'Emergency'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Lauren', 'Hill', 'lhill@parksloperestorative.com', '718-444-6789', 'General Dentist', 'dentist', 'active', 
 'Park Slope Restorative Dentistry', FALSE, TRUE, TRUE, 'Focuses on biomimetic dentistry. Mercury-free practice.',
 ARRAY['Biomimetic', 'Mercury-Free', 'Holistic'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

-- Additional 10 Aesthetic Professionals
(uuid_generate_v4(), 'Victoria', 'Adams', 'vadams@fifthavemedspa.com', '212-888-1234', 'Medical Director', 'aesthetic_doctor', 'active', 
 'Fifth Avenue Medical Spa', TRUE, TRUE, TRUE, 'Luxury medical spa. Interested in combination therapies and new technologies.',
 ARRAY['Luxury', 'Technology', 'Combination'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Robert', 'Blake', 'rblake@manhattanplasticsurgeons.com', '212-555-9876', 'Plastic Surgeon', 'plastic_surgeon', 'active', 
 'Manhattan Plastic Surgeons', TRUE, FALSE, TRUE, 'Board certified. Specializes in facial rejuvenation and body contouring.',
 ARRAY['Board Certified', 'Facial', 'Body'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Samantha', 'Jones', 'sjones@midtowndermatologyassociates.com', '212-777-5432', 'Cosmetic Dermatologist', 'cosmetic_dermatologist', 'active', 
 'Midtown Dermatology Associates', TRUE, TRUE, FALSE, 'High-volume practice. Interested in efficiency and patient flow.',
 ARRAY['High Volume', 'Efficiency', 'Cosmetic'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'David', 'Kim', 'dkim@koreatownaesthetics.com', '212-666-3456', 'Aesthetic Physician', 'aesthetic_doctor', 'active', 
 'Koreatown Aesthetics Center', FALSE, TRUE, TRUE, 'Specializes in K-beauty treatments. Asian skincare expertise.',
 ARRAY['K-Beauty', 'Asian Skin', 'International'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Emily', 'White', 'ewhite@greenwichplasticsurgery.com', '203-555-7890', 'Plastic Surgeon', 'plastic_surgeon', 'active', 
 'Greenwich Plastic Surgery Center', TRUE, TRUE, TRUE, 'Serves affluent Connecticut market. Interested in regenerative aesthetics.',
 ARRAY['Affluent', 'Regenerative', 'Connecticut'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Marcus', 'Johnson', 'mjohnson@harlemskincare.com', '212-444-8901', 'Dermatologist', 'dermatologist', 'active', 
 'Harlem Skin Care Clinic', TRUE, FALSE, TRUE, 'Specializes in ethnic skin. Community-focused practice.',
 ARRAY['Ethnic Skin', 'Community', 'Inclusive'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Ashley', 'Martinez', 'amartinez@williamsburgbeauty.com', '718-999-2345', 'Nurse Practitioner', 'nurse_practitioner', 'active', 
 'Williamsburg Beauty Bar', FALSE, TRUE, TRUE, 'Trendy neighborhood spa. Social media savvy. Millennial clientele.',
 ARRAY['Trendy', 'Social Media', 'Millennial'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Kevin', 'O''Brien', 'kobrien@longislandplastics.com', '516-555-6789', 'Plastic Surgeon', 'plastic_surgeon', 'active', 
 'Long Island Plastic Surgery', TRUE, TRUE, FALSE, 'Suburban practice. Mommy makeover specialist. Family-oriented.',
 ARRAY['Suburban', 'Mommy Makeover', 'Family'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Sophia', 'Rodriguez', 'srodriguez@westchesterdermatology.com', '914-333-4567', 'Dermatologist', 'dermatologist', 'active', 
 'Westchester Dermatology & Aesthetics', TRUE, FALSE, TRUE, 'Medical and cosmetic dermatology. Interested in combination treatments.',
 ARRAY['Medical', 'Cosmetic', 'Combination'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Brandon', 'Taylor', 'btaylor@jerseyshoremedispa.com', '732-888-5678', 'Physician Assistant', 'physician_assistant', 'active', 
 'Jersey Shore Medi Spa', FALSE, TRUE, TRUE, 'Seasonal clientele. Beach body treatments. Summer specials.',
 ARRAY['Seasonal', 'Beach Body', 'New Jersey'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE);

-- Update the public_contacts table to ensure we have the correct distribution
-- This query will help verify the count after insertion
DO $$
DECLARE
    dental_count INTEGER;
    aesthetic_count INTEGER;
BEGIN
    -- Count dental contacts
    SELECT COUNT(*) INTO dental_count 
    FROM public_contacts 
    WHERE type IN ('dentist', 'oral_surgeon', 'periodontist', 'orthodontist', 
                   'endodontist', 'prosthodontist', 'pediatric_dentist', 
                   'dental_hygienist', 'dental_assistant');
    
    -- Count aesthetic contacts
    SELECT COUNT(*) INTO aesthetic_count 
    FROM public_contacts 
    WHERE type IN ('aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 
                   'cosmetic_dermatologist', 'nurse_practitioner', 
                   'physician_assistant', 'aesthetician');
    
    -- Log the counts
    RAISE NOTICE 'Total dental contacts: %', dental_count;
    RAISE NOTICE 'Total aesthetic contacts: %', aesthetic_count;
    RAISE NOTICE 'Total contacts: %', dental_count + aesthetic_count;
END $$;