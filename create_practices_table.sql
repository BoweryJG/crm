-- Create practices table
CREATE TABLE IF NOT EXISTS public.practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  type TEXT,
  size TEXT,
  specialty TEXT,
  contact_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add practice_id to contacts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contacts' 
                AND column_name = 'practice_id') THEN
    ALTER TABLE public.contacts ADD COLUMN practice_id UUID REFERENCES practices(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_practices_city_state ON practices(city, state);
CREATE INDEX IF NOT EXISTS idx_contacts_practice_id ON contacts(practice_id);

-- Enable RLS on practices table
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for practices
CREATE POLICY "Users can view all practices" ON practices
    FOR SELECT USING (true);

CREATE POLICY "Users can insert practices" ON practices
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update practices" ON practices
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT ALL ON practices TO authenticated;

-- Add practice_name column to contacts if needed (for backward compatibility)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contacts' 
                AND column_name = 'practice_name') THEN
    ALTER TABLE public.contacts ADD COLUMN practice_name TEXT;
  END IF;
END $$;