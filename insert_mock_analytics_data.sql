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
    sentiment_score NUMERIC(3,2);
    outcome_type TEXT;
    summary_text TEXT;
    sentiment_analysis_json JSONB;
    key_phrases_json JSONB;
    action_items_json JSONB;
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

        -- Determine outcome type and sentiment score based on record number for better distribution
        -- Records 1-7: High Priority (negative sentiment) - sentiment_score < -0.3
        -- Records 8-14: Medium Priority (neutral sentiment) - sentiment_score between -0.3 and 0.3
        -- Records 15-20: Low Priority (positive sentiment) - sentiment_score > 0.3
        IF i <= 7 THEN
            -- High Priority (negative sentiment)
            sentiment_score := -0.4 - (random() * 0.6)::NUMERIC(3,2); -- Between -0.4 and -1.0 (ensuring < -0.3)
            outcome_type := 'Left Voicemail';
            summary_text := 'Summary of call ' || i || ': Several concerns raised about pricing. Customer expressed frustration with timeline. Urgent follow-up needed.';
            sentiment_analysis_json := jsonb_build_object('overall_sentiment', 'negative', 'confidence', round(random()::numeric, 2));
            key_phrases_json := jsonb_build_array('pricing concerns', 'timeline issues', 'budget constraints', 'competitor comparison');
            action_items_json := jsonb_build_array('Urgent follow-up needed', 'Prepare revised pricing', 'Schedule call with decision maker');
        ELSIF i <= 14 THEN
            -- Medium Priority (neutral sentiment)
            sentiment_score := -0.25 + (random() * 0.5)::NUMERIC(3,2); -- Between -0.25 and 0.25 (ensuring between -0.3 and 0.3)
            outcome_type := 'Scheduled Follow-up';
            summary_text := 'Summary of call ' || i || ': Discussed product features and options. Customer requested additional information. Follow-up scheduled.';
            sentiment_analysis_json := jsonb_build_object('overall_sentiment', 'neutral', 'confidence', round(random()::numeric, 2));
            key_phrases_json := jsonb_build_array('product features', 'additional information', 'follow-up meeting', 'decision timeline');
            action_items_json := jsonb_build_array('Send product information', 'Prepare demo for next call', 'Confirm meeting with team');
        ELSE
            -- Low Priority (positive sentiment)
            sentiment_score := 0.4 + (random() * 0.6)::NUMERIC(3,2); -- Between 0.4 and 1.0 (ensuring > 0.3)
            outcome_type := 'Completed Demo';
            summary_text := 'Summary of call ' || i || ': Successful product demonstration. Customer expressed strong interest and satisfaction. Moving forward with next steps.';
            sentiment_analysis_json := jsonb_build_object('overall_sentiment', 'positive', 'confidence', round(random()::numeric, 2));
            key_phrases_json := jsonb_build_array('positive feedback', 'next steps', 'implementation timeline', 'contract details');
            action_items_json := jsonb_build_array('Send contract', 'Schedule onboarding', 'Introduce to support team');
        END IF;

        -- Insert into linguistics_analysis FIRST
        INSERT INTO public.linguistics_analysis (
            id, call_id, language_metrics, key_phrases, topic_segments, sentiment_analysis, 
            action_items, questions_asked, transcript, audio_url, status, 
            contact_name, practice_name, created_at, updated_at, title, analysis_result, sentiment_score, source_type
        ) VALUES (
            linguistics_analysis_uuid, -- This is the PK for linguistics_analysis
            call_analysis_uuid, -- This will be the FK to call_analysis (which we insert next)
            jsonb_build_object('clarity_score', round((random()*0.5+0.5)::numeric, 2), 'talk_listen_ratio', round((random()*0.6+0.2)::numeric, 2)),
            key_phrases_json,
            jsonb_build_array(
                jsonb_build_object('topic', 'Introduction', 'start_time', 0, 'end_time', call_duration * 0.2),
                jsonb_build_object('topic', 'Discussion Point ' || i, 'start_time', call_duration * 0.2, 'end_time', call_duration * 0.8),
                jsonb_build_object('topic', 'Closing', 'start_time', call_duration * 0.8, 'end_time', call_duration)
            ),
            sentiment_analysis_json,
            action_items_json,
            jsonb_build_array('What are your thoughts on our proposal?', 'When would you like to schedule the next meeting?'),
            'Detailed transcript for call ' || i || '. ' || 
            CASE 
                WHEN i <= 7 THEN 'Customer: "I have concerns about the pricing structure. It seems higher than what we discussed initially. And the timeline doesn''t work for us at all." Rep: "I understand your concerns. Let me see what we can do to address these issues."'
                WHEN i <= 14 THEN 'Customer: "The features look interesting, but I need more information before making a decision. Can you send over some case studies?" Rep: "Absolutely, I''ll prepare those materials and send them over by tomorrow."'
                ELSE 'Customer: "The demo was excellent! This is exactly what we''ve been looking for. When can we start the implementation process?" Rep: "I''m thrilled to hear that! We can begin as soon as next week if that works for your team."'
            END,
            'https://example.com/recording_' || call_analysis_uuid || '.mp3',
            'completed',
            (SELECT first_name || ' ' || last_name FROM public.public_contacts WHERE id = selected_contact_id),
            (SELECT name FROM public.practices WHERE id = selected_practice_id),
            call_start - INTERVAL '1 minute',
            call_start,
            'Linguistic Analysis for Call ' || i,
            jsonb_build_object('word_count', call_duration * 2, 'filler_words_pct', round((random()*5)::numeric,1)),
            sentiment_score,
            'twilio'
        );

        -- Insert into call_analysis SECOND, referencing the linguistics_analysis_id
        INSERT INTO public.call_analysis (
            id, title, call_date, duration, contact_id, practice_id, user_id, 
            recording_url, transcript, summary, sentiment_score, linguistics_analysis_id, call_sid, created_at, updated_at, tags
        ) VALUES (
            call_analysis_uuid, -- This is the PK for call_analysis
            CASE 
                WHEN i <= 7 THEN 'Urgent: Call with Contact ' || i || ' (High Priority)'
                WHEN i <= 14 THEN 'Follow-up: Call with Contact ' || i || ' (Medium Priority)'
                ELSE 'Successful: Call with Contact ' || i || ' (Low Priority)'
            END,
            call_start,
            call_duration,
            selected_contact_id,
            selected_practice_id,
            selected_user_id,
            'https://example.com/recording_' || call_analysis_uuid || '.mp3',
            'This is a short mock transcript for call ' || i || '. ' || 
            CASE 
                WHEN i <= 7 THEN 'Discussion about pricing concerns and timeline issues.'
                WHEN i <= 14 THEN 'Reviewed product features and next steps.'
                ELSE 'Successful demo with positive feedback and implementation planning.'
            END,
            summary_text,
            sentiment_score, 
            linguistics_analysis_uuid, -- This is the FK to linguistics_analysis.id
            'CA' || substr(md5(random()::text), 0, 33),
            call_start - INTERVAL '1 minute', 
            call_start,
            CASE 
                WHEN i <= 7 THEN ARRAY['urgent', 'pricing', 'objection']
                WHEN i <= 14 THEN ARRAY['follow-up', 'info-request', 'demo']
                ELSE ARRAY['success', 'implementation', 'contract']
            END
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
            outcome_type,
            CASE 
                WHEN i <= 7 THEN 'Customer expressed concerns about pricing and timeline. Need to follow up with revised proposal.'
                WHEN i <= 14 THEN 'Customer requested additional information. Scheduled follow-up call to discuss further.'
                ELSE 'Successful demo completed. Customer ready to move forward. Preparing contract and implementation plan.'
            END,
            call_analysis_uuid, -- Link to the call_analysis record
            call_start,
            call_start
        );
    END LOOP;
END $$;
