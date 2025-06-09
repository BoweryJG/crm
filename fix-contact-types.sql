-- Fix contact types to properly categorize dental vs aesthetic contacts
-- This corrects the contact types from generic sales pipeline types to medical specialty types

-- First, let's see what we have
SELECT type, COUNT(*) as count 
FROM public_contacts 
GROUP BY type 
ORDER BY count DESC;

-- Update contacts to have proper medical specialty types
-- We'll use the practice names and titles to determine the correct specialty types

-- Update dental contacts (first 20 contacts)
UPDATE public_contacts 
SET type = CASE 
    WHEN title LIKE '%Prosthodontist%' OR practice_name LIKE '%Prosth%' THEN 'prosthodontist'
    WHEN title LIKE '%Orthodontist%' OR practice_name LIKE '%Ortho%' THEN 'orthodontist'
    WHEN title LIKE '%Endodontist%' OR practice_name LIKE '%Endo%' THEN 'endodontist'
    WHEN title LIKE '%Periodontist%' OR practice_name LIKE '%Perio%' THEN 'periodontist'
    WHEN title LIKE '%Pediatric%' OR practice_name LIKE '%Children%' OR practice_name LIKE '%Pediatric%' THEN 'pediatric_dentist'
    WHEN title LIKE '%Oral Surgeon%' OR practice_name LIKE '%Oral Surgery%' THEN 'oral_surgeon'
    WHEN title LIKE '%Practice Owner%' OR title LIKE '%General%' OR title LIKE '%Dentist%' THEN 'dentist'
    ELSE 'dentist'
END
WHERE practice_name IN (
    'NYC Smiles Design', 'Manhattan Dental Associates', 'Brooklyn Orthodontics',
    'Queens Endodontic Specialists', 'Bronx Children''s Dental', 'Staten Island Periodontics',
    'West Village Dental Studio', 'Central Park Cosmetic Dentistry', 'Flushing Dental Group',
    'Tribeca Advanced Periodontics'
)
-- Add more dental practice names from the original migration
OR practice_name LIKE '%Dental%' 
OR practice_name LIKE '%Dentistry%'
OR practice_name LIKE '%Orthodont%'
OR practice_name LIKE '%Endodont%'
OR practice_name LIKE '%Periodont%'
OR title LIKE '%Dentist%'
OR title LIKE '%Orthodontist%'
OR title LIKE '%Endodontist%'
OR title LIKE '%Periodontist%'
OR title LIKE '%Prosthodontist%';

-- Update aesthetic contacts
UPDATE public_contacts 
SET type = CASE 
    WHEN title LIKE '%Plastic Surgeon%' THEN 'plastic_surgeon'
    WHEN title LIKE '%Dermatologist%' THEN 'dermatologist'
    WHEN title LIKE '%Aesthetic Physician%' OR title LIKE '%Aesthetic Doctor%' THEN 'aesthetic_doctor'
    WHEN title LIKE '%Lead Injector%' OR title LIKE '%Medical Spa%' OR title LIKE '%Nurse Practitioner%' THEN 'nurse_practitioner'
    WHEN title LIKE '%Medical Director%' AND practice_name LIKE '%Dermatology%' THEN 'dermatologist'
    WHEN title LIKE '%Medical Director%' AND practice_name LIKE '%Aesthetic%' THEN 'aesthetic_doctor'
    ELSE 'aesthetic_doctor'
END
WHERE practice_name IN (
    'Manhattan Aesthetics', 'NY Laser Dermatology', 'SoHo Aesthetics',
    'NYC Plastic Surgery Associates', 'Tribeca Skin Center', 'Upper East Side Plastic Surgery',
    'Chelsea Medical Spa', 'Brooklyn Aesthetics', 'Queens Medical Spa', 'Bronx Dermatology Center'
)
-- Add more aesthetic practice patterns
OR practice_name LIKE '%Aesthetic%'
OR practice_name LIKE '%Dermatology%'
OR practice_name LIKE '%Plastic Surgery%'
OR practice_name LIKE '%Medical Spa%'
OR practice_name LIKE '%Skin%'
OR title LIKE '%Plastic Surgeon%'
OR title LIKE '%Dermatologist%'
OR title LIKE '%Aesthetic%'
OR title LIKE '%Injector%';

-- Verify the results
SELECT 
    type,
    COUNT(*) as count,
    ARRAY_AGG(first_name || ' ' || last_name) as examples
FROM public_contacts 
GROUP BY type 
ORDER BY count DESC;