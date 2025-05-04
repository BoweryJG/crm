-- RepSpheres CRM - Market Research Tables
-- This migration adds the necessary tables for storing market research data,
-- including NYC dental implant providers and their technology stacks.

-- Enum for CBCT Scanner Manufactuers
CREATE TYPE cbct_manufacturer AS ENUM (
  'Carestream',
  'Sirona',
  'Planmeca',
  'Vatech',
  'KaVo',
  'Morita',
  'Instrumentarium',
  'Imaging Sciences',
  'Other'
);

-- Enum for Intraoral Scanner Manufacturers
CREATE TYPE intraoral_scanner_manufacturer AS ENUM (
  'iTero',
  '3Shape TRIOS',
  'Carestream',
  'CEREC Primescan/Omnicam',
  'Medit',
  'Planmeca',
  'Other'
);

-- Enum for Implant System Manufacturers
CREATE TYPE implant_system_manufacturer AS ENUM (
  'Straumann',
  'Nobel Biocare',
  'Zimmer Biomet',
  'Dentsply Sirona',
  'Bicon',
  'BioHorizons',
  'Osstem',
  'MegaGen',
  'Neodent',
  'Other'
);

-- Table for NYC Dental Implant Providers
CREATE TABLE nyc_dental_implant_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  practice_size practice_size NOT NULL,
  is_dso BOOLEAN NOT NULL DEFAULT FALSE,
  num_practitioners INTEGER NOT NULL,
  is_solo_practitioner BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Specialties
  is_periodontist BOOLEAN NOT NULL DEFAULT FALSE,
  is_prosthodontist BOOLEAN NOT NULL DEFAULT FALSE,
  is_oral_surgeon BOOLEAN NOT NULL DEFAULT FALSE,
  is_general_dentist BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Technology stack
  has_cbct BOOLEAN NOT NULL DEFAULT FALSE,
  cbct_manufacturer cbct_manufacturer,
  cbct_model TEXT,
  has_intraoral_scanner BOOLEAN NOT NULL DEFAULT FALSE,
  intraoral_scanner_manufacturer intraoral_scanner_manufacturer,
  intraoral_scanner_model TEXT,
  has_surgical_guides BOOLEAN NOT NULL DEFAULT FALSE,
  surgical_guide_system TEXT,
  has_in_house_milling BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Implant offerings
  implant_systems implant_system_manufacturer[] NOT NULL DEFAULT '{}',
  offers_full_arch BOOLEAN NOT NULL DEFAULT FALSE,
  offers_same_day_implants BOOLEAN NOT NULL DEFAULT FALSE,
  offers_all_on_4 BOOLEAN NOT NULL DEFAULT FALSE,
  offers_all_on_6 BOOLEAN NOT NULL DEFAULT FALSE,
  offers_zygomatic_implants BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Social media presence
  instagram_handle TEXT,
  instagram_followers INTEGER,
  instagram_post_frequency TEXT,
  instagram_last_post_date TIMESTAMP WITH TIME ZONE,
  facebook_url TEXT,
  facebook_followers INTEGER,
  youtube_channel TEXT,
  youtube_subscribers INTEGER,
  linkedin_url TEXT,
  
  -- Rating information
  google_rating DECIMAL(3,1),
  google_review_count INTEGER,
  yelp_rating DECIMAL(3,1),
  yelp_review_count INTEGER,
  
  -- Additional information
  notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE nyc_dental_implant_providers ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can read nyc_dental_implant_providers"
  ON nyc_dental_implant_providers
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy for admins to edit
CREATE POLICY "Admin users can update nyc_dental_implant_providers"
  ON nyc_dental_implant_providers
  FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create index for faster searching
CREATE INDEX idx_nyc_dental_implant_providers_practice_size ON nyc_dental_implant_providers (practice_size);
CREATE INDEX idx_nyc_dental_implant_providers_is_solo_practitioner ON nyc_dental_implant_providers (is_solo_practitioner);
CREATE INDEX idx_nyc_dental_implant_providers_has_cbct ON nyc_dental_implant_providers (has_cbct);
CREATE INDEX idx_nyc_dental_implant_providers_has_intraoral_scanner ON nyc_dental_implant_providers (has_intraoral_scanner);
CREATE INDEX idx_nyc_dental_implant_providers_offers_full_arch ON nyc_dental_implant_providers (offers_full_arch);

-- Table for tracking technology adoption over time
CREATE TABLE provider_technology_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES nyc_dental_implant_providers(id),
  technology_type TEXT NOT NULL, -- 'CBCT', 'IntraoralScanner', 'SurgicalGuides', 'InHouseMilling'
  manufacturer TEXT NOT NULL,
  model TEXT,
  acquired_date TIMESTAMP WITH TIME ZONE,
  discontinued_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies to technology history
ALTER TABLE provider_technology_history ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can read provider_technology_history"
  ON provider_technology_history
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy for admins to edit
CREATE POLICY "Admin users can update provider_technology_history"
  ON provider_technology_history
  FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
  
-- Table for tracking social media metrics over time
CREATE TABLE provider_social_media_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES nyc_dental_implant_providers(id),
  platform TEXT NOT NULL, -- 'Instagram', 'Facebook', 'YouTube', 'LinkedIn'
  follower_count INTEGER,
  post_count INTEGER,
  engagement_rate DECIMAL(5,2),
  measured_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies to social media metrics
ALTER TABLE provider_social_media_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can read provider_social_media_metrics"
  ON provider_social_media_metrics
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy for admins to edit
CREATE POLICY "Admin users can update provider_social_media_metrics"
  ON provider_social_media_metrics
  FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create index for faster searching
CREATE INDEX idx_provider_social_media_metrics_provider_id ON provider_social_media_metrics (provider_id);
CREATE INDEX idx_provider_social_media_metrics_platform ON provider_social_media_metrics (platform);
CREATE INDEX idx_provider_social_media_metrics_measured_date ON provider_social_media_metrics (measured_date);

-- Function to update updated_at on record change
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update timestamps
CREATE TRIGGER update_nyc_dental_implant_providers_timestamp
BEFORE UPDATE ON nyc_dental_implant_providers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_provider_technology_history_timestamp
BEFORE UPDATE ON provider_technology_history
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_provider_social_media_metrics_timestamp
BEFORE UPDATE ON provider_social_media_metrics
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
