-- Add call-specific columns to the sales_activities table
ALTER TABLE sales_activities 
ADD COLUMN IF NOT EXISTS call_sid TEXT,
ADD COLUMN IF NOT EXISTS call_status TEXT,
ADD COLUMN IF NOT EXISTS call_duration INTEGER;

-- Create an index on call_sid for faster lookups
CREATE INDEX IF NOT EXISTS idx_sales_activities_call_sid ON sales_activities(call_sid);

-- Create a view for call activities
CREATE OR REPLACE VIEW call_activities AS
SELECT 
  sa.*,
  c.first_name as contact_first_name,
  c.last_name as contact_last_name,
  c.phone as contact_phone,
  p.name as practice_name
FROM 
  sales_activities sa
JOIN 
  contacts c ON sa.contact_id = c.id
JOIN 
  practices p ON sa.practice_id = p.id
WHERE 
  sa.type = 'call'
ORDER BY 
  sa.date DESC;

-- Add a function to update the last_contacted field in contacts when a call is logged
CREATE OR REPLACE FUNCTION update_contact_last_contacted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'call' THEN
    UPDATE contacts
    SET last_contacted = NEW.date
    WHERE id = NEW.contact_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the last_contacted field
DROP TRIGGER IF EXISTS update_contact_last_contacted_trigger ON sales_activities;
CREATE TRIGGER update_contact_last_contacted_trigger
AFTER INSERT ON sales_activities
FOR EACH ROW
EXECUTE FUNCTION update_contact_last_contacted();
