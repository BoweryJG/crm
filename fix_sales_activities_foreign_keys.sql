-- Fix sales_activities to work with both authenticated and demo mode

-- First, check current foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='sales_activities'
    AND tc.table_schema='public';

-- Drop the existing foreign key that points to public_contacts
ALTER TABLE sales_activities 
DROP CONSTRAINT IF EXISTS sales_activities_contact_id_fkey;

-- For authenticated mode: sales_activities should reference private contacts table
-- For demo mode: sales_activities can reference public_contacts
-- Solution: Remove the hard constraint and handle referential integrity at application level

-- Optional: Add a column to track which table the contact_id references
ALTER TABLE sales_activities 
ADD COLUMN IF NOT EXISTS contact_source VARCHAR(20) DEFAULT 'contacts' CHECK (contact_source IN ('contacts', 'public_contacts'));

-- Optional: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_activities_contact_id ON sales_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_sales_activities_contact_source ON sales_activities(contact_source);

-- Show the updated structure
\d sales_activities

-- Now let's also fix call_analysis table
ALTER TABLE call_analysis 
DROP CONSTRAINT IF EXISTS call_analysis_contact_id_fkey;

-- Add column to track source
ALTER TABLE call_analysis 
ADD COLUMN IF NOT EXISTS contact_source VARCHAR(20) DEFAULT 'contacts' CHECK (contact_source IN ('contacts', 'public_contacts'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_call_analysis_contact_id ON call_analysis(contact_id);
CREATE INDEX IF NOT EXISTS idx_call_analysis_contact_source ON call_analysis(contact_source);

-- Verify changes
SELECT 'Foreign keys removed. Tables can now reference both contacts and public_contacts.' as status;