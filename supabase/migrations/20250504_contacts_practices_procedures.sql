-- RepSpheres CRM Database Schema Migration
-- This migration adds the comprehensive data model for contacts, practices, and procedures

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact Types Enum
CREATE TYPE contact_type AS ENUM (
  'dentist', 'oral_surgeon', 'periodontist', 'orthodontist', 'endodontist', 
  'prosthodontist', 'pediatric_dentist', 'dental_hygienist', 'dental_assistant',
  'aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 'cosmetic_dermatologist',
  'nurse_practitioner', 'physician_assistant', 'aesthetician',
  'practice_manager', 'office_manager', 'other'
);

-- Contact Status Enum
CREATE TYPE contact_status AS ENUM (
  'active', 'lead', 'prospect', 'customer', 'inactive', 'do_not_contact'
);

-- Contact Specialization Enum
CREATE TYPE contact_specialization AS ENUM (
  'general_dentistry', 'cosmetic_dentistry', 'implantology', 'prosthodontics',
  'orthodontics', 'endodontics', 'periodontics', 'pediatric_dentistry', 'oral_surgery',
  'facial_aesthetics', 'injectables', 'botox_fillers', 'laser_treatments', 'skin_care',
  'body_contouring', 'hair_restoration', 'tattoo_removal', 'scar_revision',
  'general_plastic_surgery', 'other'
);

-- Interaction Type Enum
CREATE TYPE interaction_type AS ENUM (
  'email', 'phone', 'video_call', 'in_person', 'social_media', 'event',
  'trade_show', 'conference', 'demo', 'training', 'follow_up', 'other'
);

-- Practice Type Enum
CREATE TYPE practice_type AS ENUM (
  'general_dental', 'specialty_dental', 'dental_group', 'dental_dso', 'dental_school',
  'aesthetic_clinic', 'medical_spa', 'plastic_surgery_center', 'dermatology_clinic',
  'multi_specialty', 'hospital', 'health_system', 'other'
);

-- Practice Status Enum
CREATE TYPE practice_status AS ENUM (
  'active', 'lead', 'prospect', 'customer', 'inactive', 'do_not_contact'
);

-- Practice Size Enum
CREATE TYPE practice_size AS ENUM (
  'solo', 'small', 'medium', 'large', 'enterprise'
);

-- Procedure Category Enum
CREATE TYPE aesthetic_procedure_category AS ENUM (
  'injectables', 'facial_treatments', 'laser_procedures', 'body_contouring',
  'skin_rejuvenation', 'hair_treatments', 'tattoo_removal', 'vein_treatments',
  'skincare', 'other'
);

-- Dental Procedure Category Enum
CREATE TYPE dental_procedure_category AS ENUM (
  'diagnostic', 'preventive', 'restorative', 'endodontics', 'periodontics',
  'prosthodontics', 'implantology', 'oral_surgery', 'orthodontics',
  'cosmetic_dentistry', 'pediatric_dentistry', 'digital_dentistry', 'other'
);

-- Create Practices Table
CREATE TABLE IF NOT EXISTS practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type practice_type NOT NULL,
  size practice_size NOT NULL,
  status practice_status NOT NULL,
  website TEXT,
  phone TEXT,
  email TEXT,
  year_established INTEGER,
  number_of_practitioners INTEGER,
  number_of_staff INTEGER,
  number_of_operatories INTEGER,
  number_of_treatment_rooms INTEGER,
  decision_making_process TEXT,
  purchasing_process TEXT,
  budget TEXT,
  annual_spend DECIMAL,
  patient_volume TEXT,
  profile_image_url TEXT,
  logo_url TEXT,
  notes TEXT,
  custom JSONB,
  tags TEXT[],
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID NOT NULL REFERENCES auth.users(id),
  parent_practice_id UUID REFERENCES practices(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Practice Addresses Table
CREATE TABLE IF NOT EXISTS practice_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  street1 TEXT NOT NULL,
  street2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Practice Specialties Table
CREATE TABLE IF NOT EXISTS practice_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Practice Technologies Table
CREATE TABLE IF NOT EXISTS practice_technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Specializations Junction Table
CREATE TABLE IF NOT EXISTS contact_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  specialization contact_specialization NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Interactions Table
CREATE TABLE IF NOT EXISTS contact_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type interaction_type NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  outcome TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Aesthetic Procedures Table
CREATE TABLE IF NOT EXISTS aesthetic_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  alternate_names TEXT[],
  category aesthetic_procedure_category NOT NULL,
  description TEXT NOT NULL,
  patient_concerns TEXT[],
  popularity INTEGER CHECK (popularity BETWEEN 1 AND 10),
  cost_low DECIMAL,
  cost_high DECIMAL,
  cost_average DECIMAL,
  cost_currency TEXT DEFAULT 'USD',
  procedure_time_min INTEGER,
  procedure_time_max INTEGER,
  procedure_time_avg INTEGER,
  recovery_time TEXT,
  pain_level INTEGER CHECK (pain_level BETWEEN 1 AND 10),
  risks TEXT[],
  contraindications TEXT[],
  pre_care_procedure TEXT,
  post_care_procedure TEXT,
  results_duration TEXT,
  results_time_to_results TEXT,
  results_maintenance_needed BOOLEAN DEFAULT FALSE,
  results_maintenance_frequency TEXT,
  training_required TEXT[],
  certification_needed BOOLEAN DEFAULT FALSE,
  certification_source TEXT[],
  typical_roi TEXT,
  marketing_tips TEXT[],
  target_demographic TEXT[],
  patient_retention TEXT,
  complementary_procedures TEXT[],
  alternative_procedures TEXT[],
  before_after_images TEXT[],
  videos TEXT[],
  scientific_studies TEXT[],
  marketing_materials TEXT[],
  consent_forms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create Dental Procedures Table
CREATE TABLE IF NOT EXISTS dental_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  alternate_names TEXT[],
  category dental_procedure_category NOT NULL,
  description TEXT NOT NULL,
  insurance_codes TEXT[],
  patient_concerns TEXT[],
  frequency TEXT,
  cost_low DECIMAL,
  cost_high DECIMAL,
  cost_average DECIMAL,
  cost_currency TEXT DEFAULT 'USD',
  insurance_typically_covered BOOLEAN DEFAULT FALSE,
  insurance_average_coverage INTEGER CHECK (insurance_average_coverage BETWEEN 0 AND 100),
  insurance_notes TEXT,
  procedure_time_min INTEGER,
  procedure_time_max INTEGER,
  procedure_time_avg INTEGER,
  pain_level INTEGER CHECK (pain_level BETWEEN 1 AND 10),
  risks TEXT[],
  contraindications TEXT[],
  pre_care_procedure TEXT,
  post_care_procedure TEXT,
  results_durability TEXT,
  results_success_rate TEXT,
  results_maintenance_needed BOOLEAN DEFAULT FALSE,
  results_maintenance_frequency TEXT,
  specialty_required BOOLEAN DEFAULT FALSE,
  common_performers TEXT[],
  training_required TEXT[],
  typical_roi TEXT,
  marketing_tips TEXT[],
  patient_retention TEXT,
  complementary_procedures TEXT[],
  alternative_procedures TEXT[],
  before_after_images TEXT[],
  videos TEXT[],
  scientific_studies TEXT[],
  marketing_materials TEXT[],
  patient_education_materials TEXT[],
  consent_forms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create Procedure Equipment Tables
CREATE TABLE IF NOT EXISTS aesthetic_procedure_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_id UUID NOT NULL REFERENCES aesthetic_procedures(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  manufacturer TEXT[],
  common_models TEXT[],
  cost_low DECIMAL,
  cost_high DECIMAL,
  cost_average DECIMAL,
  cost_currency TEXT DEFAULT 'USD',
  lease_options BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dental_procedure_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_id UUID NOT NULL REFERENCES dental_procedures(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  manufacturer TEXT[],
  common_models TEXT[],
  cost_low DECIMAL,
  cost_high DECIMAL,
  cost_average DECIMAL,
  cost_currency TEXT DEFAULT 'USD',
  lease_options BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Procedure Supplies Tables
CREATE TABLE IF NOT EXISTS aesthetic_procedure_supplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_id UUID NOT NULL REFERENCES aesthetic_procedures(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  product_category TEXT,
  manufacturer TEXT,
  usage_per_procedure TEXT,
  is_essential BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dental_procedure_supplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_id UUID NOT NULL REFERENCES dental_procedures(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  product_category TEXT,
  manufacturer TEXT,
  usage_per_procedure TEXT,
  is_essential BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Procedures Junction Tables
CREATE TABLE IF NOT EXISTS contact_aesthetic_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES aesthetic_procedures(id) ON DELETE CASCADE,
  procedure_name TEXT NOT NULL,
  is_performing BOOLEAN DEFAULT FALSE,
  is_interested BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_dental_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES dental_procedures(id) ON DELETE CASCADE,
  procedure_name TEXT NOT NULL,
  is_performing BOOLEAN DEFAULT FALSE,
  is_interested BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Practice Procedures Junction Tables
CREATE TABLE IF NOT EXISTS practice_aesthetic_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES aesthetic_procedures(id) ON DELETE CASCADE,
  procedure_name TEXT NOT NULL,
  is_performing BOOLEAN DEFAULT FALSE,
  is_interested BOOLEAN DEFAULT FALSE,
  volume TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS practice_dental_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES dental_procedures(id) ON DELETE CASCADE,
  procedure_name TEXT NOT NULL,
  is_performing BOOLEAN DEFAULT FALSE,
  is_interested BOOLEAN DEFAULT FALSE,
  volume TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Practice Revenue table
CREATE TABLE IF NOT EXISTS practice_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  estimated_annual DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS Policies
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_procedure_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_procedure_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_procedure_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_procedure_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_aesthetic_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_dental_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_aesthetic_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_dental_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_revenue ENABLE ROW LEVEL SECURITY;

-- Default policies (users can only see their own records or team records)
CREATE POLICY "Users can view their own practices"
  ON practices FOR SELECT
  USING (created_by = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users can insert their own practices"
  ON practices FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own practices"
  ON practices FOR UPDATE
  USING (created_by = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users can delete their own practices"
  ON practices FOR DELETE
  USING (created_by = auth.uid());

-- Similar policies would be created for all other tables
-- Will add more granular policies based on organization roles later

-- Create indexes for performance
CREATE INDEX idx_contacts_practice_id ON contacts(practice_id);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_created_by ON contacts(created_by);
CREATE INDEX idx_contact_interactions_contact_id ON contact_interactions(contact_id);
CREATE INDEX idx_practice_addresses_practice_id ON practice_addresses(practice_id);
CREATE INDEX idx_practice_specialties_practice_id ON practice_specialties(practice_id);
CREATE INDEX idx_contact_specializations_contact_id ON contact_specializations(contact_id);
