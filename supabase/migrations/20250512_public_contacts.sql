-- Create Public Contacts Table for Demo Purposes
-- This table will contain mock data accessible to all users

-- Create Public Contacts Table (similar structure to contacts but for public demo)
CREATE TABLE IF NOT EXISTS public_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  title TEXT,
  type contact_type NOT NULL,
  status contact_status NOT NULL,
  practice_id UUID REFERENCES practices(id) ON DELETE SET NULL,
  practice_name TEXT,
  profile_image_url TEXT,
  decision_maker BOOLEAN NOT NULL DEFAULT FALSE,
  influencer BOOLEAN NOT NULL DEFAULT FALSE,
  purchaser BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  birthday TEXT,
  last_interaction_date TIMESTAMP WITH TIME ZONE,
  last_interaction_type interaction_type,
  custom JSONB,
  tags TEXT[],
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_starred BOOLEAN DEFAULT FALSE
);

-- Create Public Contact Specializations Junction Table
CREATE TABLE IF NOT EXISTS public_contact_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES public_contacts(id) ON DELETE CASCADE,
  specialization contact_specialization NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 20 mock contacts for demonstration purposes
INSERT INTO public_contacts (
  id, first_name, last_name, email, phone, title, type, status, 
  practice_name, decision_maker, influencer, purchaser, notes, 
  tags, created_by, assigned_to, is_starred
) VALUES
-- Dental Professionals
(uuid_generate_v4(), 'Robert', 'Johnson', 'rjohnson@nycimplants.com', '212-555-1234', 'Lead Periodontist', 'periodontist', 'active', 
 'NYC Dental Implants Center', TRUE, TRUE, FALSE, 'Interested in Straumann BLX implant system. Prefers early morning meetings.',
 ARRAY['Implants', 'Surgical'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Sarah', 'Chang', 'schang@columbia.edu', '212-305-7676', 'Program Director', 'periodontist', 'active', 
 'Columbia Dental Implant Center', TRUE, TRUE, TRUE, 'Very influential in the teaching program. Conducts regular lunch and learns.',
 ARRAY['Academic', 'Implants', 'Prosthetics'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Mark', 'Stein', 'mstein@nyoms.com', '212-888-4760', 'Oral Surgeon', 'oral_surgeon', 'active', 
 'New York Oral & Maxillofacial Surgery', TRUE, FALSE, TRUE, 'Interested in guided surgery solutions. Performs zygomatic implants.',
 ARRAY['Implants', 'Surgical', 'Zygomatic'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'David', 'Wong', 'dwong@midtownperio.com', '212-777-5432', 'Periodontist', 'periodontist', 'active', 
 'Midtown Periodontics', TRUE, FALSE, TRUE, 'Focuses on minimally invasive techniques. Looking for new regenerative materials.',
 ARRAY['Periodontics', 'Regenerative'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Lisa', 'Patel', 'lpatel@nycsmiles.com', '212-444-8765', 'Prosthodontist', 'prosthodontist', 'active', 
 'NYC Smiles Design', FALSE, TRUE, FALSE, 'Specializes in full mouth rehabilitation. Interested in digital workflow solutions.',
 ARRAY['Prosthetics', 'Digital', 'CAD/CAM'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'James', 'Wilson', 'jwilson@manhattandental.com', '212-333-9876', 'Practice Owner', 'dentist', 'active', 
 'Manhattan Dental Associates', TRUE, TRUE, TRUE, 'Multi-location practice. Decision maker for equipment purchases.',
 ARRAY['General', 'Business Owner'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Emily', 'Rodriguez', 'erodriguez@brooklynortho.com', '718-555-2345', 'Orthodontist', 'orthodontist', 'active', 
 'Brooklyn Orthodontics', TRUE, FALSE, TRUE, 'Early adopter of new technologies. Interested in clear aligner innovations.',
 ARRAY['Orthodontics', 'Clear Aligners'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Michael', 'Kim', 'mkim@queensendo.com', '718-444-3456', 'Endodontist', 'endodontist', 'active', 
 'Queens Endodontic Specialists', FALSE, TRUE, FALSE, 'Interested in microscope-enhanced endodontics and new file systems.',
 ARRAY['Endodontics', 'Microscope'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Sophia', 'Martinez', 'smartinez@bronxdental.com', '718-666-4567', 'Pediatric Dentist', 'pediatric_dentist', 'active', 
 'Bronx Children''s Dental', TRUE, FALSE, TRUE, 'Focuses on special needs patients. Looking for sedation solutions.',
 ARRAY['Pediatric', 'Special Needs'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Daniel', 'Taylor', 'dtaylor@statenislandperio.com', '718-777-5678', 'Periodontist', 'periodontist', 'active', 
 'Staten Island Periodontics', TRUE, TRUE, FALSE, 'Specializes in laser-assisted periodontal therapy. Early technology adopter.',
 ARRAY['Periodontics', 'Laser', 'Technology'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

-- Aesthetic Professionals
(uuid_generate_v4(), 'Jennifer', 'Smith', 'jsmith@manhattanaesthetics.com', '212-777-8899', 'Lead Injector', 'nurse_practitioner', 'active', 
 'Manhattan Aesthetics', TRUE, FALSE, TRUE, 'Specializes in facial rejuvenation. Looking for premium filler products.',
 ARRAY['Injectables', 'Fillers', 'Premium'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Michael', 'Reynolds', 'mreynolds@nylaserdermatology.com', '212-333-4567', 'Medical Director', 'dermatologist', 'active', 
 'NY Laser Dermatology', TRUE, TRUE, TRUE, 'Interested in next-gen laser technology. High-volume practice.',
 ARRAY['Lasers', 'Technology', 'Skin'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Olivia', 'Chen', 'ochen@sohoaesthetics.com', '212-666-7890', 'Aesthetic Physician', 'aesthetic_doctor', 'active', 
 'SoHo Aesthetics', TRUE, FALSE, TRUE, 'Specializes in non-surgical facial rejuvenation. Interested in thread lifts.',
 ARRAY['Non-surgical', 'Threads', 'Rejuvenation'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'William', 'Garcia', 'wgarcia@nycplasticsurgery.com', '212-888-9012', 'Plastic Surgeon', 'plastic_surgeon', 'active', 
 'NYC Plastic Surgery Associates', TRUE, TRUE, TRUE, 'Specializes in facial plastic surgery. Looking for complementary non-surgical options.',
 ARRAY['Surgical', 'Facial', 'Combination Therapy'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Ava', 'Thompson', 'athompson@tribecaskin.com', '212-999-0123', 'Dermatologist', 'dermatologist', 'active', 
 'Tribeca Skin Center', TRUE, FALSE, TRUE, 'Focuses on cosmetic dermatology. Interested in energy-based devices.',
 ARRAY['Dermatology', 'Energy Devices', 'Skin'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Ethan', 'Brown', 'ebrown@uppereastsideplastics.com', '212-222-1234', 'Plastic Surgeon', 'plastic_surgeon', 'active', 
 'Upper East Side Plastic Surgery', TRUE, TRUE, FALSE, 'High-end practice. Interested in premium products and VIP patient experience.',
 ARRAY['Luxury', 'Premium', 'Surgical'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Isabella', 'Lee', 'ilee@chelseamedspa.com', '212-333-2345', 'Medical Spa Director', 'nurse_practitioner', 'active', 
 'Chelsea Medical Spa', TRUE, FALSE, TRUE, 'Manages high-volume medical spa. Looking for efficient treatment protocols.',
 ARRAY['Med Spa', 'Volume', 'Efficiency'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Noah', 'Miller', 'nmiller@brooklynaesthetics.com', '718-444-3456', 'Aesthetic Physician', 'aesthetic_doctor', 'active', 
 'Brooklyn Aesthetics', TRUE, TRUE, FALSE, 'Growing practice in trendy area. Interested in body contouring devices.',
 ARRAY['Body', 'Contouring', 'Growth'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE),

(uuid_generate_v4(), 'Mia', 'Davis', 'mdavis@queensmedspa.com', '718-555-4567', 'Lead Injector', 'nurse_practitioner', 'active', 
 'Queens Medical Spa', FALSE, TRUE, TRUE, 'Specializes in natural-looking results. Interested in cannula techniques.',
 ARRAY['Natural', 'Injectables', 'Techniques'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', TRUE),

(uuid_generate_v4(), 'Alexander', 'Wilson', 'awilson@bronxdermatology.com', '718-666-5678', 'Dermatologist', 'dermatologist', 'active', 
 'Bronx Dermatology Center', TRUE, FALSE, TRUE, 'Serves diverse patient population. Interested in treatments for all skin types.',
 ARRAY['Diversity', 'Inclusivity', 'Skin Types'], '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', FALSE);

-- Create a policy to allow all authenticated users to read public_contacts
ALTER TABLE public_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all users to read public_contacts"
  ON public_contacts FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_public_contacts_assigned_to ON public_contacts(assigned_to);
CREATE INDEX idx_public_contacts_created_by ON public_contacts(created_by);
CREATE INDEX idx_public_contact_specializations_contact_id ON public_contact_specializations(contact_id);
