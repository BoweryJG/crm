-- Delete the 20 most recently added records from call_analysis and their associated linguistics_analysis records

-- First, identify the 20 most recent call_analysis records
WITH recent_calls AS (
    SELECT id, linguistics_analysis_id
    FROM call_analysis
    ORDER BY created_at DESC
    LIMIT 20
)

-- Delete the call_analysis records
DELETE FROM call_analysis
WHERE id IN (SELECT id FROM recent_calls);

-- Delete any orphaned linguistics_analysis records
DELETE FROM linguistics_analysis
WHERE id NOT IN (
    SELECT linguistics_analysis_id 
    FROM call_analysis 
    WHERE linguistics_analysis_id IS NOT NULL
);

-- Confirm the deletion
SELECT 'Deleted the 20 most recent call_analysis records and their associated linguistics_analysis records.' AS message;
