-- SQL script to insert sample linguistics data for testing
-- Created: May 24, 2025

-- First, get the existing call_analysis IDs
WITH call_ids AS (
  SELECT id FROM call_analysis LIMIT 20
)

-- Insert sample linguistics_analysis records for each call
INSERT INTO linguistics_analysis (
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
  created_at,
  updated_at
)
SELECT
  'Call Analysis for ' || id,
  'https://example.com/recordings/' || id || '.mp3',
  'This is a sample transcript for call ' || id,
  json_build_object(
    'language_metrics', json_build_object(
      'speaking_pace', (random() * 50 + 120)::int,
      'talk_to_listen_ratio', random() * 2,
      'filler_word_frequency', random() * 0.2,
      'technical_language_level', (random() * 10)::int,
      'interruption_count', (random() * 5)::int,
      'average_response_time', random() * 3
    ),
    'topic_segments', json_build_array(
      json_build_object(
        'topic', 'Product Introduction',
        'start_time', 0,
        'end_time', 120,
        'keywords', array['product', 'features', 'benefits'],
        'summary', 'Introduction to product features and benefits'
      ),
      json_build_object(
        'topic', 'Pricing Discussion',
        'start_time', 121,
        'end_time', 240,
        'keywords', array['price', 'discount', 'offer'],
        'summary', 'Discussion about pricing and potential discounts'
      ),
      json_build_object(
        'topic', 'Next Steps',
        'start_time', 241,
        'end_time', 300,
        'keywords', array['follow-up', 'demo', 'meeting'],
        'summary', 'Planning next steps and follow-up actions'
      )
    ),
    'action_items', json_build_array(
      json_build_object(
        'description', 'Send product brochure',
        'timestamp', 65,
        'priority', 'high',
        'status', 'pending'
      ),
      json_build_object(
        'description', 'Schedule follow-up call',
        'timestamp', 245,
        'priority', 'medium',
        'status', 'pending'
      )
    )
  ),
  (random() * 2 - 1)::numeric(3,2),
  ARRAY['product', 'pricing', 'follow-up', 'demo', 'features'],
  'completed',
  id,
  'twilio',
  'Demo Contact ' || id,
  NOW(),
  NOW()
FROM call_ids
ON CONFLICT DO NOTHING;

-- Update call_analysis records to link to the linguistics_analysis records
UPDATE call_analysis ca
SET linguistics_analysis_id = la.id
FROM linguistics_analysis la
WHERE ca.id = la.call_id
AND ca.linguistics_analysis_id IS NULL;

-- Output the number of records created
SELECT 'Created ' || COUNT(*) || ' linguistics_analysis records' as result
FROM linguistics_analysis;

SELECT 'Updated ' || COUNT(*) || ' call_analysis records with linguistics_analysis_id' as result
FROM call_analysis
WHERE linguistics_analysis_id IS NOT NULL;
