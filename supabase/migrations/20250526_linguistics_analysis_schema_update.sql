-- Migration to update the linguistics_analysis table schema with advanced analytics fields
-- This migration adds new fields for advanced sales analytics and coaching

-- First, check if the function exists, if not create it
CREATE OR REPLACE FUNCTION update_linguistics_analysis_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the linguistics_analysis table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.linguistics_analysis (
  id uuid not null default extensions.uuid_generate_v4 (),
  call_id uuid null,
  language_metrics jsonb null,
  key_phrases jsonb null,
  topic_segments jsonb null,
  sentiment_analysis jsonb null,
  action_items jsonb null,
  questions_asked jsonb null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  source_type text null,
  title text null default 'Call Analysis'::text,
  audio_url text null default 'https://example.com/recordings/default.mp3'::text,
  transcript text null,
  analysis_result jsonb null default '{}'::jsonb,
  sentiment_score numeric null default 0,
  status text null default 'completed'::text,
  contact_name text null,
  practice_name text null,
  persuasion_techniques jsonb null default '{}'::jsonb,
  sales_strategy_adherence jsonb null default '{}'::jsonb,
  psychological_profile jsonb null default '{}'::jsonb,
  manipulation_detection jsonb null default '{}'::jsonb,
  objection_handling_analysis jsonb null default '{}'::jsonb,
  coaching_recommendations text null,
  buyer_personality_type text null,
  trust_rapport_score numeric null default 0,
  influence_effectiveness_score numeric null default 0,
  conversation_control_score numeric null default 0,
  harvey_specter_analysis text null,
  next_steps_generated jsonb null default '{}'::jsonb,
  buyer_disc_profile text null,
  decision_making_style text null,
  leverage_points jsonb null default '{}'::jsonb,
  power_dynamics_analysis jsonb null default '{}'::jsonb,
  emotional_intelligence_score numeric null default 0,
  closing_readiness_score numeric null default 0,
  competitive_positioning jsonb null default '{}'::jsonb,
  risk_assessment jsonb null default '{}'::jsonb,
  recommended_follow_up_timing text null,
  suggested_demo_focus jsonb null default '{}'::jsonb,
  pricing_sensitivity_analysis jsonb null default '{}'::jsonb,
  stakeholder_influence_map jsonb null default '{}'::jsonb,
  conversation_momentum_score numeric null default 0,
  ethical_concerns_flagged jsonb null default '{}'::jsonb,
  constraint linguistics_analyses_pkey primary key (id),
  constraint linguistics_analysis_source_type_check check (
    (
      source_type = any (
        array['upload'::text, 'twilio'::text, 'other'::text]
      )
    )
  )
);

-- Create index on call_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_linguistics_analysis_call_id 
ON public.linguistics_analysis USING btree (call_id);

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS set_timestamp_linguistics_analysis ON linguistics_analysis;
CREATE TRIGGER set_timestamp_linguistics_analysis
BEFORE UPDATE ON linguistics_analysis
FOR EACH ROW
EXECUTE FUNCTION update_linguistics_analysis_modified_column();

-- Add RLS policies for the linguistics_analysis table
ALTER TABLE public.linguistics_analysis ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select linguistics_analysis" ON public.linguistics_analysis;
DROP POLICY IF EXISTS "Allow authenticated users to insert linguistics_analysis" ON public.linguistics_analysis;
DROP POLICY IF EXISTS "Allow authenticated users to update linguistics_analysis" ON public.linguistics_analysis;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select linguistics_analysis"
ON public.linguistics_analysis
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert linguistics_analysis"
ON public.linguistics_analysis
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update linguistics_analysis"
ON public.linguistics_analysis
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Add sample data for testing
INSERT INTO public.linguistics_analysis (
  call_id, 
  title, 
  transcript, 
  sentiment_score, 
  key_phrases, 
  analysis_result,
  contact_name,
  practice_name,
  persuasion_techniques,
  sales_strategy_adherence,
  psychological_profile,
  coaching_recommendations,
  buyer_personality_type,
  trust_rapport_score,
  influence_effectiveness_score,
  conversation_control_score,
  buyer_disc_profile,
  decision_making_style,
  emotional_intelligence_score,
  closing_readiness_score,
  recommended_follow_up_timing
)
SELECT 
  id as call_id,
  'Sample Call Analysis ' || row_number() over() as title,
  'This is a sample transcript for a call with a dental practice discussing implant solutions.' as transcript,
  (random() * 2 - 1) as sentiment_score,
  '["dental implants", "pricing", "follow-up", "competitor comparison"]'::jsonb as key_phrases,
  json_build_object(
    'language_metrics', json_build_object(
      'speaking_pace', 140 + (random() * 30)::int,
      'talk_to_listen_ratio', 0.5 + random(),
      'filler_word_frequency', random() * 0.1,
      'technical_language_level', 5 + (random() * 4)::int
    ),
    'topic_segments', json_build_array(
      json_build_object(
        'topic', 'Introduction and Needs Assessment',
        'start_time', 0,
        'end_time', 120,
        'keywords', array['introduction', 'needs', 'assessment']
      ),
      json_build_object(
        'topic', 'Product Presentation',
        'start_time', 121,
        'end_time', 300,
        'keywords', array['features', 'benefits', 'demonstration']
      ),
      json_build_object(
        'topic', 'Pricing Discussion',
        'start_time', 301,
        'end_time', 420,
        'keywords', array['pricing', 'cost', 'investment']
      ),
      json_build_object(
        'topic', 'Objection Handling',
        'start_time', 421,
        'end_time', 540,
        'keywords', array['objection', 'concern', 'resolution']
      ),
      json_build_object(
        'topic', 'Next Steps',
        'start_time', 541,
        'end_time', 600,
        'keywords', array['follow-up', 'demo', 'decision']
      )
    ),
    'action_items', json_build_array(
      json_build_object(
        'description', 'Send follow-up email with pricing',
        'timestamp', 550,
        'priority', 'high',
        'status', 'pending'
      ),
      json_build_object(
        'description', 'Schedule product demo',
        'timestamp', 580,
        'priority', 'medium',
        'status', 'pending'
      )
    )
  )::jsonb as analysis_result,
  'Dr. ' || (ARRAY['Smith', 'Jones', 'Williams', 'Brown', 'Davis'])[floor(random() * 5 + 1)] as contact_name,
  (ARRAY['Bright Smiles Dental', 'Modern Dentistry', 'Family Dental Care', 'Advanced Dental Arts', 'Gentle Dental Center'])[floor(random() * 5 + 1)] as practice_name,
  json_build_object(
    'reciprocity', floor(random() * 10 + 1),
    'commitment_consistency', floor(random() * 10 + 1),
    'social_proof', floor(random() * 10 + 1),
    'authority', floor(random() * 10 + 1),
    'liking', floor(random() * 10 + 1),
    'scarcity', floor(random() * 10 + 1)
  )::jsonb as persuasion_techniques,
  json_build_object(
    'discovery_quality', floor(random() * 10 + 1),
    'value_proposition_clarity', floor(random() * 10 + 1),
    'objection_handling', floor(random() * 10 + 1),
    'closing_technique', floor(random() * 10 + 1)
  )::jsonb as sales_strategy_adherence,
  json_build_object(
    'communication_style', (ARRAY['Analytical', 'Driver', 'Amiable', 'Expressive'])[floor(random() * 4 + 1)],
    'risk_tolerance', floor(random() * 10 + 1),
    'influence_receptivity', floor(random() * 10 + 1)
  )::jsonb as psychological_profile,
  CASE WHEN random() > 0.5 
    THEN 'Focus on improving value articulation and ROI explanation. Practice more effective discovery questions.'
    ELSE 'Strong presentation of value proposition. Continue developing objection handling skills.'
  END as coaching_recommendations,
  (ARRAY['Analytical', 'Driver', 'Amiable', 'Expressive'])[floor(random() * 4 + 1)] as buyer_personality_type,
  5 + random() * 5 as trust_rapport_score,
  4 + random() * 6 as influence_effectiveness_score,
  3 + random() * 7 as conversation_control_score,
  (ARRAY['D', 'I', 'S', 'C', 'DI', 'DC', 'IS', 'SC'])[floor(random() * 8 + 1)] as buyer_disc_profile,
  (ARRAY['Analytical', 'Intuitive', 'Collaborative', 'Directive', 'Consensus-driven'])[floor(random() * 5 + 1)] as decision_making_style,
  6 + random() * 4 as emotional_intelligence_score,
  4 + random() * 6 as closing_readiness_score,
  (ARRAY['24 hours', '3 days', '1 week', '2 weeks'])[floor(random() * 4 + 1)] as recommended_follow_up_timing
FROM 
  call_analysis
WHERE 
  NOT EXISTS (SELECT 1 FROM linguistics_analysis WHERE linguistics_analysis.call_id = call_analysis.id)
LIMIT 10;

-- Add comment to the table
COMMENT ON TABLE public.linguistics_analysis IS 'Stores detailed linguistics analysis of sales calls with advanced metrics';
