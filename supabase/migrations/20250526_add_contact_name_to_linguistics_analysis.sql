-- Migration to add contact_name column to linguistics_analysis
ALTER TABLE linguistics_analysis
ADD COLUMN IF NOT EXISTS contact_name TEXT;

