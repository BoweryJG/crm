-- Mock Data for Rep Analytics Demo
-- IMPORTANT: Replace placeholder UUIDs for user_id with actual user_id values from your auth.users table.
-- You should have 2-3 mock rep users in your auth.users table.

-- Placeholder User IDs (replace with actual UUIDs from your auth.users table)
-- Example: '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'
-- For this script, we'll use three placeholders:
-- DEFINE rep_user_id_1 UUID := '61a5e4c1-af23-4c07-812a-df2a12aed0c61_here'; -- Replace this
-- DEFINE rep_user_id_2 UUID := '8ac061e1-fc4b-45c4-9bb6-3828d53e3595'; -- Replace this
-- DEFINE rep_user_id_3 UUID := 'fca40e85-8ccf-4e76-bf35-74bde56419af'; -- Replace this
-- Since direct variable definition isn't standard across all SQL clients for Supabase,
-- you'll need to manually replace these in the INSERT statements below.

-- Mock Practices
INSERT INTO public.practices (id, name, location, created_at) VALUES
(uuid_generate_v4(), 'Downtown Dental Group', '123 Main St, Anytown, USA', NOW()),
(uuid_generate_v4(), 'Uptown Aesthetics Clinic', '456 Oak Ave, Anytown, USA', NOW()),
(uuid_generate_v4(), 'Suburban Family Health', '789 Pine Ln, Anytown, USA', NOW())
ON CONFLICT (id) DO NOTHING;

-- Get Practice IDs (adjust if you have specific IDs you want to use)
-- This is a bit tricky in a single script without procedural SQL.
-- For simplicity, we'll assume these are the first three practices or you'll manually link.
-- Let's assume we'll pick them in order for the mock data.

-- Mock Contacts for public_contacts
-- Ensure these contacts are linked to practices if your schema/logic requires it.
-- For simplicity, we'll create some and then link them in call_analysis.
INSERT INTO public.public_contacts (id, first_name, last_name, email, phone, practice_name, title, specialization, created_at, updated_at) VALUES
(uuid_generate_v4(), 'Alice', 'Wonder', 'alice.wonder@example.com', '555-0101', 'Downtown Dental Group', 'DDS', 'General Dentistry', NOW(), NOW()),
(uuid_generate_v4(), 'Bob', 'Builder', 'bob.builder@example.com', '555-0102', 'Uptown Aesthetics Clinic', 'MD', 'Dermatology', NOW(), NOW()),
(uuid_generate_v4(), 'Carol', 'Danvers', 'carol.danvers@example.com', '555-0103', 'Suburban Family Health', 'NP', 'Family Medicine', NOW(), NOW()),
(uuid_generate_v4(), 'David', 'Copper', 'david.copper@example.com', '555-0104', 'Downtown Dental Group', 'DMD', 'Orthodontics', NOW(), NOW()),
(uuid_generate_v4(), 'Eve', 'Moneypenny', 'eve.moneypenny@example.com', '555-0105', 'Uptown Aesthetics Clinic', 'PA', 'Cosmetic Surgery', NOW(), NOW()),
(uuid_generate_v4(), 'Frank', 'Castle', 'frank.castle@example.com', '555-0106', 'Downtown Dental Group', 'DDS', 'Pediatric Dentistry', NOW(), NOW()),
(uuid_generate_v4(), 'Grace', 'Hopper', 'grace.hopper@example.com', '555-0107', 'Uptown Aesthetics Clinic', 'MD', 'Plastic Surgery', NOW(), NOW()),
(uuid_generate_v4(), 'Henry', 'Jones', 'henry.jones@example.com', '555-0108', 'Suburban Family Health', 'DO', 'General Practice', NOW(), NOW()),
(uuid_generate_v4(), 'Ivy', 'Valentine', 'ivy.valentine@example.com', '555-0109', 'Downtown Dental Group', 'DMD', 'Endodontics', NOW(), NOW()),
(uuid_generate_v4(), 'Jack', 'Sparrow', 'jack.sparrow@example.com', '555-0110', 'Uptown Aesthetics Clinic', 'MD', 'Aesthetic Medicine', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Generate 20 mock records for call_analysis, linguistics_analysis, and sales_activities
DO $$
DECLARE
    rep_ids UUID[] := ARRAY[
        '8ac061e1-fc4b-45c4-9bb6-3828d53e3595',
        'fca40e85-8ccf-4e76-bf35-74bde56419af',
        '3152209a-a281-4415-96fc-3552503266b7'
    ];
    contact_ids UUID[];
    practice_ids UUID[];
    call_analysis_uuid UUID;
    linguistics_analysis_uuid UUID;
    sales_activity_uuid UUID;
    selected_contact_id UUID;
    selected_practice_id UUID;
    selected_user_id UUID;
    call_start TIMESTAMP WITH TIME ZONE;
    call_duration INTEGER;
    i INTEGER;
BEGIN
    -- Fetch existing contact and practice IDs
    SELECT array_agg(id) INTO contact_ids FROM public.public_contacts;
    SELECT array_agg(id) INTO practice_ids FROM public.practices;

    -- Ensure there are contacts and practices to select from
    IF array_length(contact_ids, 1) IS NULL OR array_length(practice_ids, 1) IS NULL THEN
        RAISE NOTICE 'No contacts or practices found. Please add some first.';
        RETURN;
    END IF;
    
    IF array_length(rep_ids, 1) IS NULL OR rep_ids[1] = '00000000-0000-0000-0000-000000000001' THEN
        RAISE NOTICE 'Placeholder REP User IDs are used. Please replace them with actual UUIDs from your auth.users table in the script.';
        -- You might want to RETURN here if strict checking is needed, or let it proceed with placeholder/potentially invalid UUIDs.
    END IF;

    FOR i IN 1..20 LOOP
        call_analysis_uuid := uuid_generate_v4();
        linguistics_analysis_uuid := uuid_generate_v4(); -- This will be used as the ID for linguistics_analysis and FK in call_analysis
        sales_activity_uuid := uuid_generate_v4();

        selected_contact_id := contact_ids[1 + floor(random() * array_length(contact_ids, 1))];
        selected_practice_id := practice_ids[1 + floor(random() * array_length(practice_ids, 1))];
        selected_user_id := rep_ids[1 + floor(random() * array_length(rep_ids, 1))]; -- Assigns one of the three rep IDs

        call_duration := floor(random() * (1800 - 60 + 1) + 60)::INTEGER; -- Duration between 1-30 minutes
        call_start := NOW() - (floor(random() * 30) || ' days')::INTERVAL - (floor(random() * 24) || ' hours')::INTERVAL - (floor(random() * 60) || ' minutes')::INTERVAL;

        -- Insert into linguistics_analysis FIRST
        INSERT INTO public.linguistics_analysis (
            id, call_id, language_metrics, key_phrases, topic_segments, sentiment_analysis, 
            action_items, questions_asked, transcript, audio_url, status, 
            contact_name, practice_name, created_at, updated_at, title, analysis_result, sentiment_score, source_type
        ) VALUES (
            linguistics_analysis_uuid, -- This is the PK for linguistics_analysis
            call_analysis_uuid, -- This will be the FK to call_analysis (which we insert next)
            jsonb_build_object('clarity_score', round((random()*0.5+0.5)::numeric, 2), 'talk_listen_ratio', round((random()*0.6+0.2)::numeric, 2)),
            jsonb_build_array('pricing', 'contract', 'next steps', 'feature ' || i),
            jsonb_build_array(
                jsonb_build_object('topic', 'Introduction', 'start_time', 0, 'end_time', call_duration * 0.2),
                jsonb_build_object('topic', 'Discussion Point ' || i, 'start_time', call_duration * 0.2, 'end_time', call_duration * 0.8),
                jsonb_build_object('topic', 'Closing', 'start_time', call_duration * 0.8, 'end_time', call_duration)
            ),
            jsonb_build_object('overall_sentiment', CASE WHEN random() > 0.5 THEN 'positive' ELSE 'neutral' END, 'confidence', round(random()::numeric, 2)),
            jsonb_build_array('Follow up on item ' || i, 'Send proposal by EOD'),
            jsonb_build_array('What are your thoughts on X?', 'Can we move forward with Y?'),
            'Detailed transcript for call ' || i || '. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            'https://example.com/recording_' || call_analysis_uuid || '.mp3',
            'completed',
            (SELECT first_name || ' ' || last_name FROM public.public_contacts WHERE id = selected_contact_id),
            (SELECT name FROM public.practices WHERE id = selected_practice_id),
            call_start - INTERVAL '1 minute',
            call_start,
            'Linguistic Analysis for Call ' || i,
            jsonb_build_object('word_count', call_duration * 2, 'filler_words_pct', round((random()*5)::numeric,1)),
            (random() * 2 - 1)::NUMERIC(3,2),
            'twilio'
        );

        -- Insert into call_analysis SECOND, referencing the linguistics_analysis_id
        INSERT INTO public.call_analysis (
            id, title, call_date, duration, contact_id, practice_id, user_id, 
            recording_url, transcript, summary, sentiment_score, linguistics_analysis_id, call_sid, created_at, updated_at, tags
        ) VALUES (
            call_analysis_uuid, -- This is the PK for call_analysis
            'Call with Contact ' || i,
            call_start,
            call_duration,
            selected_contact_id,
            selected_practice_id,
            selected_user_id,
            'https://example.com/recording_' || call_analysis_uuid || '.mp3',
            'This is a short mock transcript for call ' || i || '. Discussed various important topics.',
            'Summary of call ' || i || ': Key points were covered, follow-up scheduled.',
            (random() * 2 - 1)::NUMERIC(3,2), 
            linguistics_analysis_uuid, -- This is the FK to linguistics_analysis.id
            'CA' || substr(md5(random()::text), 0, 33),
            call_start - INTERVAL '1 minute', 
            call_start,
            CASE WHEN random() > 0.5 THEN ARRAY['follow-up', 'demo'] ELSE ARRAY['pricing', 'objection'] END
        );

        -- Insert into sales_activities
        INSERT INTO public.sales_activities (
            id, type, contact_id, user_id, date, duration, outcome, notes, call_analysis_id, created_at, updated_at
        ) VALUES (
            sales_activity_uuid,
            'call',
            selected_contact_id,
            selected_user_id, 
            call_start,
            call_duration,
            CASE floor(random()*3)::int
                WHEN 0 THEN 'Completed Demo'
                WHEN 1 THEN 'Scheduled Follow-up'
                ELSE 'Left Voicemail'
            END,
            'Notes for sales activity related to call ' || i,
            call_analysis_uuid, -- Link to the call_analysis record
            call_start,
            call_start
        );
    END LOOP;
END $$;
