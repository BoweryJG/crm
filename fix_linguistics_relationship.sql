-- Script to fix the relationship between call_analysis and linguistics_analysis

-- 1. Verify the tables exist
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'call_analysis'
) AS call_analysis_exists;

SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'linguistics_analysis'
) AS linguistics_analysis_exists;

-- 2. Verify the column exists in call_analysis
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'call_analysis' 
  AND column_name = 'linguistics_analysis_id'
) AS linguistics_analysis_id_exists;

-- 3. Check if there are any call_analysis records with linguistics_analysis_id set
SELECT COUNT(*) AS call_analysis_with_linguistics FROM call_analysis 
WHERE linguistics_analysis_id IS NOT NULL;

-- 4. Check if there are any linguistics_analysis records
SELECT COUNT(*) AS linguistics_analysis_count FROM linguistics_analysis;

-- 5. Verify the foreign key constraint exists
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
  AND tc.table_name = 'call_analysis'
  AND kcu.column_name = 'linguistics_analysis_id';

-- 6. Fix: Ensure the foreign key constraint is properly set
ALTER TABLE call_analysis
DROP CONSTRAINT IF EXISTS call_analysis_linguistics_analysis_id_fkey;

ALTER TABLE call_analysis
ADD CONSTRAINT call_analysis_linguistics_analysis_id_fkey 
  FOREIGN KEY (linguistics_analysis_id) 
  REFERENCES linguistics_analysis(id) 
  ON DELETE SET NULL;

-- 7. Fix: Update the RLS policies to ensure proper access
ALTER TABLE linguistics_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view linguistics_analysis" ON linguistics_analysis;
CREATE POLICY "Authenticated users can view linguistics_analysis"
  ON linguistics_analysis FOR SELECT
  USING (true);

-- 8. Sample query to verify the join works
SELECT
  ca.id AS call_analysis_id,
  ca.title AS call_title,
  la.id AS linguistics_analysis_id,
  la.title AS linguistics_title
FROM
  call_analysis ca
LEFT JOIN
  linguistics_analysis la ON ca.linguistics_analysis_id = la.id
LIMIT 5;
