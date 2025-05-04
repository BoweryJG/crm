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

-- Similar policies for other tables
-- In a real application, you would create more granular policies based on user roles
