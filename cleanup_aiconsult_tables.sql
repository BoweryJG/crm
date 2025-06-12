-- Cleanup Script: Remove AiConsult and YomiStrike tables
-- IMPORTANT: Run backup_before_cleanup.sql FIRST!

-- Drop YomiStrike table
DROP TABLE IF EXISTS public.yomistrike_sessions CASCADE;

-- Drop empty AiConsult tables
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.consult_requests CASCADE;

-- Drop all AIME tables (AiConsult consultation system)
DROP TABLE IF EXISTS public.aime_analysis_results CASCADE;
DROP TABLE IF EXISTS public.aime_consultation_requests CASCADE;
DROP TABLE IF EXISTS public.aime_patient_realself_connections CASCADE;
DROP TABLE IF EXISTS public.aime_popular_searches CASCADE;
DROP TABLE IF EXISTS public.aime_provider_availability CASCADE;
DROP TABLE IF EXISTS public.aime_providers CASCADE;
DROP TABLE IF EXISTS public.aime_realself_analytics CASCADE;
DROP TABLE IF EXISTS public.aime_realself_cache CASCADE;
DROP TABLE IF EXISTS public.aime_realself_doctors CASCADE;
DROP TABLE IF EXISTS public.aime_search_history CASCADE;
DROP TABLE IF EXISTS public.aime_user_preferences CASCADE;
DROP TABLE IF EXISTS public.aime_user_profiles CASCADE;
DROP TABLE IF EXISTS public.aime_user_sessions CASCADE;

-- Archive aesthetic backup tables (rename instead of drop)
ALTER TABLE IF EXISTS public.aesthetic_procedures_backup 
RENAME TO archive_aesthetic_procedures_backup;

ALTER TABLE IF EXISTS public.aesthetic_procedures_backup_20250108 
RENAME TO archive_aesthetic_procedures_backup_20250108;

ALTER TABLE IF EXISTS public.aesthetic_procedures_backup_maturity_20250108 
RENAME TO archive_aesthetic_procedures_backup_maturity_20250108;

ALTER TABLE IF EXISTS public.aesthetic_companies_backup 
RENAME TO archive_aesthetic_companies_backup;

-- Summary of changes
SELECT 'Cleanup completed. Removed:' as status,
       '- yomistrike_sessions' as removed_1,
       '- clients (empty)' as removed_2,
       '- consult_requests (empty)' as removed_3,
       '- 13 aime_* tables' as removed_4,
       '- Archived 4 backup tables' as archived;