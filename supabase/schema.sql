-- Supabase Schema for RepSpheres CRM
-- This file contains the SQL schema for creating tables in Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sales_rep', 'manager', 'readonly')),
  profile_image_url TEXT,
  territory TEXT,
  specialization TEXT CHECK (specialization IN ('dental', 'aesthetic', 'both')),
  phone TEXT,
  preferences JSONB NOT NULL DEFAULT '{"theme": "space", "notifications_enabled": true, "default_dashboard_view": "summary"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practices
CREATE TABLE IF NOT EXISTS practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  type TEXT NOT NULL CHECK (type IN ('dental', 'aesthetic', 'combined', 'other')),
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  patient_volume INTEGER,
  annual_revenue NUMERIC,
  procedures TEXT[],
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'lead')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  profile_image_url TEXT,
  specialization TEXT NOT NULL CHECK (specialization IN ('dental', 'aesthetic', 'both', 'other')),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'lead', 'prospect')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Contacts (for demo data)
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

-- Public Contact Specializations
CREATE TABLE IF NOT EXISTS public_contact_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES public_contacts(id) ON DELETE CASCADE,
  specialization contact_specialization NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 20 demo public contacts
INSERT INTO public_contacts (
  id, first_name, last_name, email, phone, title, type, status,
  practice_name, decision_maker, influencer, purchaser, notes,
  tags, created_by, assigned_to, is_starred
) VALUES
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

-- Indexes for public contacts
CREATE INDEX idx_public_contacts_assigned_to ON public_contacts(assigned_to);
CREATE INDEX idx_public_contacts_created_by ON public_contacts(created_by);
CREATE INDEX idx_public_contact_specializations_contact_id ON public_contact_specializations(contact_id);
CREATE INDEX idx_call_analysis_contact_id ON call_analysis(contact_id);
CREATE INDEX idx_call_analysis_call_date ON call_analysis(call_date);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT NOT NULL,
  industry TEXT NOT NULL CHECK (industry IN ('dental', 'aesthetic', 'both', 'other')),
  founded_year INTEGER,
  headquarters TEXT NOT NULL,
  description TEXT NOT NULL,
  products TEXT[] NOT NULL,
  procedures TEXT[],
  market_share NUMERIC,
  annual_revenue NUMERIC,
  key_contacts TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procedures
CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dental', 'aesthetic')),
  subcategory TEXT NOT NULL,
  description TEXT NOT NULL,
  average_cost NUMERIC,
  companies TEXT[],
  typical_duration INTEGER,
  recovery_time TEXT,
  popularity_score INTEGER CHECK (popularity_score >= 1 AND popularity_score <= 10),
  technical_complexity INTEGER CHECK (technical_complexity >= 1 AND technical_complexity <= 10),
  training_required TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  practice_id UUID REFERENCES practices(id) ON DELETE SET NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  reminder TIMESTAMP WITH TIME ZONE,
  assigned_to UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Activities
CREATE TABLE IF NOT EXISTS sales_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo', 'follow_up', 'other')),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER,
  notes TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('successful', 'unsuccessful', 'follow_up_required', 'no_decision')),
  next_steps TEXT,
  associated_procedures TEXT[],
  associated_companies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Analysis
CREATE TABLE IF NOT EXISTS call_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  call_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  practice_id UUID REFERENCES practices(id) ON DELETE SET NULL,
  recording_url TEXT,
  transcript TEXT,
  summary TEXT,
  sentiment_score NUMERIC,
  linguistics_analysis_id TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 20 demo call analyses
INSERT INTO call_analysis (
  id, title, call_date, duration, contact_id, practice_id, recording_url,
  transcript, summary, sentiment_score, linguistics_analysis_id, tags, notes
) VALUES
  (uuid_generate_v4(), 'Demo Call 1', NOW() - INTERVAL '20 days', 600, NULL, NULL,
   'https://example.com/calls/1.mp3', 'Transcript 1', 'Summary 1', 0.2, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 2', NOW() - INTERVAL '18 days', 720, NULL, NULL,
   'https://example.com/calls/2.mp3', 'Transcript 2', 'Summary 2', -0.1, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 3', NOW() - INTERVAL '16 days', 450, NULL, NULL,
   'https://example.com/calls/3.mp3', 'Transcript 3', 'Summary 3', 0.4, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 4', NOW() - INTERVAL '14 days', 900, NULL, NULL,
   'https://example.com/calls/4.mp3', 'Transcript 4', 'Summary 4', 0.7, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 5', NOW() - INTERVAL '12 days', 300, NULL, NULL,
   'https://example.com/calls/5.mp3', 'Transcript 5', 'Summary 5', -0.3, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 6', NOW() - INTERVAL '10 days', 480, NULL, NULL,
   'https://example.com/calls/6.mp3', 'Transcript 6', 'Summary 6', 0.1, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 7', NOW() - INTERVAL '9 days', 660, NULL, NULL,
   'https://example.com/calls/7.mp3', 'Transcript 7', 'Summary 7', 0.0, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 8', NOW() - INTERVAL '8 days', 540, NULL, NULL,
   'https://example.com/calls/8.mp3', 'Transcript 8', 'Summary 8', 0.5, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 9', NOW() - INTERVAL '7 days', 780, NULL, NULL,
   'https://example.com/calls/9.mp3', 'Transcript 9', 'Summary 9', -0.2, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 10', NOW() - INTERVAL '6 days', 360, NULL, NULL,
   'https://example.com/calls/10.mp3', 'Transcript 10', 'Summary 10', 0.3, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 11', NOW() - INTERVAL '5 days', 420, NULL, NULL,
   'https://example.com/calls/11.mp3', 'Transcript 11', 'Summary 11', 0.6, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 12', NOW() - INTERVAL '4 days', 510, NULL, NULL,
   'https://example.com/calls/12.mp3', 'Transcript 12', 'Summary 12', 0.8, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 13', NOW() - INTERVAL '3 days', 390, NULL, NULL,
   'https://example.com/calls/13.mp3', 'Transcript 13', 'Summary 13', -0.4, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 14', NOW() - INTERVAL '2 days', 600, NULL, NULL,
   'https://example.com/calls/14.mp3', 'Transcript 14', 'Summary 14', 0.9, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 15', NOW() - INTERVAL '1 day', 720, NULL, NULL,
   'https://example.com/calls/15.mp3', 'Transcript 15', 'Summary 15', 0.2, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 16', NOW() - INTERVAL '23 hours', 330, NULL, NULL,
   'https://example.com/calls/16.mp3', 'Transcript 16', 'Summary 16', -0.5, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 17', NOW() - INTERVAL '20 hours', 450, NULL, NULL,
   'https://example.com/calls/17.mp3', 'Transcript 17', 'Summary 17', 0.0, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 18', NOW() - INTERVAL '18 hours', 480, NULL, NULL,
   'https://example.com/calls/18.mp3', 'Transcript 18', 'Summary 18', 0.4, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 19', NOW() - INTERVAL '12 hours', 600, NULL, NULL,
   'https://example.com/calls/19.mp3', 'Transcript 19', 'Summary 19', -0.1, NULL, ARRAY['demo'], 'Sample notes'),
  (uuid_generate_v4(), 'Demo Call 20', NOW() - INTERVAL '6 hours', 510, NULL, NULL,
   'https://example.com/calls/20.mp3', 'Transcript 20', 'Summary 20', 0.3, NULL, ARRAY['demo'], 'Sample notes');

-- Market Intelligence
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dental', 'aesthetic', 'industry', 'technology', 'regulations', 'other')),
  relevance_score INTEGER NOT NULL CHECK (relevance_score >= 1 AND relevance_score <= 10),
  regions_affected TEXT[] NOT NULL,
  companies_affected TEXT[],
  procedures_affected TEXT[],
  publication_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER set_timestamp_user_profiles
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_practices
BEFORE UPDATE ON practices
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_contacts
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_companies
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_procedures
BEFORE UPDATE ON procedures
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_tasks
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_sales_activities
BEFORE UPDATE ON sales_activities
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_call_analysis
BEFORE UPDATE ON call_analysis
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_public_contacts
BEFORE UPDATE ON public_contacts
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_public_contact_specializations
BEFORE UPDATE ON public_contact_specializations
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_market_intelligence
BEFORE UPDATE ON market_intelligence
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS (Row Level Security) to restrict data access

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_contact_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- These are basic policies that should be customized based on specific business rules

-- User profiles - users can see all profiles but only modify their own
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = auth_id);

-- Practices - all authenticated users can view/edit
CREATE POLICY "Authenticated users can view practices"
  ON practices FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert practices"
  ON practices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update practices"
  ON practices FOR UPDATE
  USING (true);

-- Allow all authenticated users to read demo public contacts
CREATE POLICY "Allow all users to read public_contacts"
  ON public_contacts FOR SELECT
  USING (true);

-- Indexes for demo tables
CREATE INDEX idx_public_contacts_assigned_to ON public_contacts(assigned_to);
CREATE INDEX idx_public_contacts_created_by ON public_contacts(created_by);
CREATE INDEX idx_public_contact_specializations_contact_id ON public_contact_specializations(contact_id);

-- Similar policies for other tables
-- In a real application, you would create more granular policies based on user roles
