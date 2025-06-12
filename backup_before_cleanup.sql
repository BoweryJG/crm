-- Backup Script: Create backup of tables before cleanup
-- Run this in Supabase SQL Editor before proceeding

-- Create backup schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS backup_20250106;

-- Backup yomistrike_sessions
CREATE TABLE backup_20250106.yomistrike_sessions AS 
SELECT * FROM public.yomistrike_sessions;

-- Backup clients table
CREATE TABLE backup_20250106.clients AS 
SELECT * FROM public.clients;

-- Backup consult_requests table
CREATE TABLE backup_20250106.consult_requests AS 
SELECT * FROM public.consult_requests;

-- Backup all aime tables
CREATE TABLE backup_20250106.aime_analysis_results AS 
SELECT * FROM public.aime_analysis_results;

CREATE TABLE backup_20250106.aime_consultation_requests AS 
SELECT * FROM public.aime_consultation_requests;

CREATE TABLE backup_20250106.aime_patient_realself_connections AS 
SELECT * FROM public.aime_patient_realself_connections;

CREATE TABLE backup_20250106.aime_popular_searches AS 
SELECT * FROM public.aime_popular_searches;

CREATE TABLE backup_20250106.aime_provider_availability AS 
SELECT * FROM public.aime_provider_availability;

CREATE TABLE backup_20250106.aime_providers AS 
SELECT * FROM public.aime_providers;

CREATE TABLE backup_20250106.aime_realself_analytics AS 
SELECT * FROM public.aime_realself_analytics;

CREATE TABLE backup_20250106.aime_realself_cache AS 
SELECT * FROM public.aime_realself_cache;

CREATE TABLE backup_20250106.aime_realself_doctors AS 
SELECT * FROM public.aime_realself_doctors;

CREATE TABLE backup_20250106.aime_search_history AS 
SELECT * FROM public.aime_search_history;

CREATE TABLE backup_20250106.aime_user_preferences AS 
SELECT * FROM public.aime_user_preferences;

CREATE TABLE backup_20250106.aime_user_profiles AS 
SELECT * FROM public.aime_user_profiles;

CREATE TABLE backup_20250106.aime_user_sessions AS 
SELECT * FROM public.aime_user_sessions;

-- Verify backups
SELECT 
    'Backup completed. Tables backed up:' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'backup_20250106';