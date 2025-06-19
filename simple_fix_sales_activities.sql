-- Simple fix: Just drop the foreign key constraints that are blocking us

-- 1. Drop the constraint that forces sales_activities to only use public_contacts
ALTER TABLE sales_activities 
DROP CONSTRAINT IF EXISTS sales_activities_contact_id_fkey;

-- 2. Drop the constraint that forces call_analysis to only use public_contacts  
ALTER TABLE call_analysis 
DROP CONSTRAINT IF EXISTS call_analysis_contact_id_fkey;

-- That's it! Now both tables can reference contacts from either table
-- The app logic will handle which table to use based on auth status

SELECT 'Foreign key constraints removed. Tables can now work with both authenticated and demo contacts.' as status;