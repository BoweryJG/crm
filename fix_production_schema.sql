-- Fix Production Schema and Data Issues
-- Run this script in your Supabase SQL editor

-- ============================================
-- PART 1: Ensure Research Module Tables Exist
-- ============================================

-- First, check if the update_modified_column function exists
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Research Module Tables (if they don't exist)
-- This is from the 20250511_research_module.sql migration

-- Research Project Status Enum
DO $$ BEGIN
    CREATE TYPE research_project_status AS ENUM (
        'active',
        'completed',
        'archived',
        'on_hold'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Research Document Type Enum
DO $$ BEGIN
    CREATE TYPE research_document_type AS ENUM (
        'market_analysis',
        'competitor_profile',
        'practice_profile',
        'trend_analysis',
        'technology_assessment',
        'literature_review',
        'survey_results',
        'interview_notes',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Research Projects Table
CREATE TABLE IF NOT EXISTS research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status research_project_status NOT NULL DEFAULT 'active',
    created_by UUID NOT NULL,
    assigned_to UUID[] DEFAULT '{}',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    related_practices UUID[] DEFAULT '{}',
    related_contacts UUID[] DEFAULT '{}',
    priority INTEGER DEFAULT 3,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Research Documents Table
CREATE TABLE IF NOT EXISTS research_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES research_projects(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    document_type research_document_type NOT NULL,
    created_by UUID NOT NULL,
    is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    ai_prompt_id UUID,
    version INTEGER NOT NULL DEFAULT 1,
    parent_document_id UUID REFERENCES research_documents(id),
    tags TEXT[] DEFAULT '{}',
    related_practices UUID[] DEFAULT '{}',
    related_contacts UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on research tables
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for research tables
CREATE POLICY "Authenticated users can read research_projects"
    ON research_projects FOR SELECT
    USING (true);

CREATE POLICY "Users can create research_projects"
    ON research_projects FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update research_projects"
    ON research_projects FOR UPDATE
    USING (true);

CREATE POLICY "Authenticated users can read research_documents"
    ON research_documents FOR SELECT
    USING (true);

CREATE POLICY "Users can create research_documents"
    ON research_documents FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update research_documents"
    ON research_documents FOR UPDATE
    USING (true);

-- ============================================
-- PART 2: Fix Linguistics Analysis Relationship
-- ============================================

-- Ensure the linguistics_analysis table has all necessary columns
ALTER TABLE linguistics_analysis 
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Call Analysis',
ADD COLUMN IF NOT EXISTS audio_url TEXT DEFAULT 'https://example.com/recordings/default.mp3',
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS analysis_result JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS sentiment_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS key_phrases JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS call_id UUID,
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'twilio',
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS practice_name TEXT;

-- Create sample linguistics analysis data for existing call_analysis records
-- This will create linguistics records for calls that don't have them
INSERT INTO linguistics_analysis (
    id,
    title,
    audio_url,
    transcript,
    analysis_result,
    sentiment_score,
    key_phrases,
    status,
    call_id,
    source_type,
    contact_name,
    practice_name,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4() as id,
    COALESCE(ca.title, 'Call Analysis ' || ca.id) as title,
    COALESCE(ca.recording_url, 'https://example.com/recordings/' || ca.id || '.mp3') as audio_url,
    COALESCE(ca.transcript, 'Sample transcript for call ' || ca.id) as transcript,
    jsonb_build_object(
        'language_metrics', jsonb_build_object(
            'speaking_pace', 140 + floor(random() * 40),
            'talk_to_listen_ratio', 0.8 + random() * 0.4,
            'filler_word_frequency', random() * 0.1,
            'technical_language_level', 5 + floor(random() * 5),
            'interruption_count', floor(random() * 5),
            'average_response_time', 1 + random() * 2
        ),
        'topic_segments', jsonb_build_array(
            jsonb_build_object(
                'topic', 'Product Introduction',
                'start_time', 0,
                'end_time', 120,
                'keywords', ARRAY['product', 'features', 'benefits'],
                'summary', 'Discussed product features and benefits'
            ),
            jsonb_build_object(
                'topic', 'Pricing Discussion',
                'start_time', 121,
                'end_time', 300,
                'keywords', ARRAY['pricing', 'cost', 'value'],
                'summary', 'Reviewed pricing options and value proposition'
            )
        ),
        'action_items', jsonb_build_array(
            jsonb_build_object(
                'description', 'Send follow-up email with pricing',
                'timestamp', 250,
                'priority', 'high',
                'status', 'pending'
            )
        ),
        'opportunity_score', jsonb_build_object(
            'score', 60 + floor(random() * 40),
            'factors', jsonb_build_object(
                'engagement', 70 + floor(random() * 30),
                'objection_resolution', 60 + floor(random() * 40),
                'needs_alignment', 80 + floor(random() * 20),
                'pricing_receptivity', 50 + floor(random() * 50)
            )
        )
    ) as analysis_result,
    COALESCE(ca.sentiment_score, (random() * 2 - 1)::numeric) as sentiment_score,
    jsonb_build_array('dental implants', 'pricing', 'follow-up') as key_phrases,
    'completed' as status,
    ca.id as call_id,
    'twilio' as source_type,
    'Unknown Contact' as contact_name,
    'Unknown Practice' as practice_name,
    ca.created_at,
    NOW() as updated_at
FROM call_analysis ca
WHERE ca.linguistics_analysis_id IS NULL
LIMIT 50; -- Create linguistics data for up to 50 calls without it

-- Update call_analysis records to link to the newly created linguistics_analysis records
UPDATE call_analysis ca
SET linguistics_analysis_id = la.id
FROM linguistics_analysis la
WHERE la.call_id = ca.id
AND ca.linguistics_analysis_id IS NULL;

-- ============================================
-- PART 3: Add Sample Research Data
-- ============================================

-- Insert sample research projects
INSERT INTO research_projects (title, description, status, created_by, tags, priority, progress)
VALUES 
    ('Dental Implant Market Analysis Q2 2025', 'Comprehensive analysis of dental implant market trends', 'active', '00000000-0000-0000-0000-000000000000'::uuid, ARRAY['dental', 'implants', 'market'], 1, 45),
    ('Aesthetic Practice Growth Strategies', 'Research on growth strategies for aesthetic practices', 'active', '00000000-0000-0000-0000-000000000000'::uuid, ARRAY['aesthetic', 'growth', 'strategy'], 2, 30)
ON CONFLICT DO NOTHING;

-- Insert sample research documents
INSERT INTO research_documents (project_id, title, content, document_type, created_by)
SELECT 
    p.id,
    'Market Overview - ' || p.title,
    'This document provides an overview of the market research findings...',
    'market_analysis'::research_document_type,
    '00000000-0000-0000-0000-000000000000'::uuid
FROM research_projects p
WHERE NOT EXISTS (
    SELECT 1 FROM research_documents d WHERE d.project_id = p.id
)
LIMIT 2;

-- ============================================
-- PART 4: Verify Data Integrity
-- ============================================

-- Check how many call_analysis records now have linguistics data
SELECT 
    COUNT(*) as total_calls,
    COUNT(linguistics_analysis_id) as calls_with_linguistics,
    COUNT(*) - COUNT(linguistics_analysis_id) as calls_without_linguistics
FROM call_analysis;

-- Check if research tables have data
SELECT 
    'research_projects' as table_name, 
    COUNT(*) as record_count 
FROM research_projects
UNION ALL
SELECT 
    'research_documents' as table_name, 
    COUNT(*) as record_count 
FROM research_documents;

-- ============================================
-- PART 5: Additional Indexes for Performance
-- ============================================

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_call_analysis_linguistics_id ON call_analysis(linguistics_analysis_id);
CREATE INDEX IF NOT EXISTS idx_linguistics_analysis_call_id ON linguistics_analysis(call_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_created_by ON research_projects(created_by);
CREATE INDEX IF NOT EXISTS idx_research_documents_project_id ON research_documents(project_id);
