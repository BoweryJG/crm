-- OPTIONAL: Add 'demo' as a valid type for sales_activities
-- WARNING: This modifies the table structure - use with caution

-- First, drop the existing constraint
ALTER TABLE public_sales_activities 
DROP CONSTRAINT IF EXISTS public_sales_activities_type_check;

-- Then add the new constraint with 'demo' included
ALTER TABLE public_sales_activities 
ADD CONSTRAINT public_sales_activities_type_check 
CHECK (type IN ('call', 'email', 'meeting', 'demo', 'follow_up', 'other'));

-- Now you can use 'demo' as a type
-- UPDATE the activity to use 'demo' instead of 'meeting'
UPDATE public_sales_activities 
SET type = 'demo' 
WHERE notes LIKE '%demonstration%' AND type = 'meeting';