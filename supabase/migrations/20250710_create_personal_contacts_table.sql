-- Personal Contacts Table Migration
-- Creates a private contacts table for individual use only
-- Author: Jason Golden (jasonwilliamgolden@gmail.com)
-- Date: 2025-07-10

-- 1. Create personal_contacts table with same structure as contacts
CREATE TABLE IF NOT EXISTS personal_contacts (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic contact information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  phone_number TEXT, -- Alternative phone field
  cell TEXT, -- Cell phone
  title TEXT,
  
  -- Location
  city TEXT,
  state TEXT,
  territory TEXT,
  
  -- Professional information
  type TEXT,
  specialty TEXT,
  practice_name TEXT,
  practice_volume TEXT,
  
  -- Scoring and prioritization
  quality_score TEXT,
  activity_count TEXT,
  overall_score INTEGER,
  contact_priority TEXT,
  lead_tier TEXT,
  
  -- Technology and interests
  technologies_mentioned TEXT,
  tech_interests TEXT,
  
  -- Business metrics
  estimated_deal_value INTEGER,
  purchase_timeline TEXT,
  
  -- Notes and tags
  notes TEXT,
  summary TEXT,
  tags TEXT[],
  
  -- User tracking (always the owner)
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  
  -- Status fields
  status TEXT DEFAULT 'active',
  is_starred BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT personal_contacts_user_check CHECK (user_id = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd')
);

-- 2. Enable Row Level Security
ALTER TABLE personal_contacts ENABLE ROW LEVEL SECURITY;

-- 3. Create strict RLS policies - ONLY for Jason Golden
-- SELECT policy - only owner can view
CREATE POLICY "personal_contacts_select_policy" ON personal_contacts FOR SELECT
USING (user_id = auth.uid() AND auth.uid() = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd');

-- INSERT policy - only owner can insert
CREATE POLICY "personal_contacts_insert_policy" ON personal_contacts FOR INSERT
WITH CHECK (user_id = auth.uid() AND auth.uid() = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd');

-- UPDATE policy - only owner can update
CREATE POLICY "personal_contacts_update_policy" ON personal_contacts FOR UPDATE
USING (user_id = auth.uid() AND auth.uid() = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd')
WITH CHECK (user_id = auth.uid() AND auth.uid() = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd');

-- DELETE policy - only owner can delete
CREATE POLICY "personal_contacts_delete_policy" ON personal_contacts FOR DELETE
USING (user_id = auth.uid() AND auth.uid() = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd');

-- 4. Create indexes for performance
CREATE INDEX idx_personal_contacts_user_id ON personal_contacts(user_id);
CREATE INDEX idx_personal_contacts_email ON personal_contacts(email);
CREATE INDEX idx_personal_contacts_name ON personal_contacts(first_name, last_name);
CREATE INDEX idx_personal_contacts_created_at ON personal_contacts(created_at DESC);
CREATE INDEX idx_personal_contacts_overall_score ON personal_contacts(overall_score DESC);
CREATE INDEX idx_personal_contacts_starred ON personal_contacts(is_starred) WHERE is_starred = TRUE;
CREATE INDEX idx_personal_contacts_search ON personal_contacts USING gin(
  to_tsvector('english', 
    coalesce(first_name, '') || ' ' || 
    coalesce(last_name, '') || ' ' || 
    coalesce(email, '') || ' ' || 
    coalesce(city, '') || ' ' || 
    coalesce(state, '') || ' ' || 
    coalesce(specialty, '') || ' ' ||
    coalesce(practice_name, '') || ' ' ||
    coalesce(notes, '')
  )
);

-- 5. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_personal_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER personal_contacts_updated_at_trigger
BEFORE UPDATE ON personal_contacts
FOR EACH ROW
EXECUTE FUNCTION update_personal_contacts_updated_at();

-- 6. Add helpful comments
COMMENT ON TABLE personal_contacts IS 'Private contacts table for Jason Golden only - no sharing, no marketplace';
COMMENT ON COLUMN personal_contacts.user_id IS 'Always references the owner (Jason Golden)';
COMMENT ON COLUMN personal_contacts.is_starred IS 'Personal star/favorite flag';
COMMENT ON COLUMN personal_contacts.overall_score IS 'Personal scoring metric for prioritization';

-- 7. Grant necessary permissions (even though RLS will control access)
GRANT ALL ON personal_contacts TO authenticated;