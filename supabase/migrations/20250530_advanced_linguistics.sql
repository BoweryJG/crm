-- Create advanced_linguistics_analysis table for comprehensive conversational intelligence
CREATE TABLE IF NOT EXISTS advanced_linguistics_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID REFERENCES call_analysis(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  overall_sentiment VARCHAR(20) CHECK (overall_sentiment IN ('positive', 'neutral', 'negative')),
  confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Psychological Profile
  psychological_profile JSONB,
  
  -- Conversation Dynamics
  conversation_dynamics JSONB,
  
  -- Power Analysis
  power_analysis JSONB,
  
  -- Sales Insights
  sales_insights JSONB,
  
  -- Key Moments
  key_moments JSONB,
  
  -- Coaching Opportunities
  coaching_opportunities JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_advanced_linguistics_call_id ON advanced_linguistics_analysis(call_id);
CREATE INDEX IF NOT EXISTS idx_advanced_linguistics_sentiment ON advanced_linguistics_analysis(overall_sentiment);
CREATE INDEX IF NOT EXISTS idx_advanced_linguistics_confidence ON advanced_linguistics_analysis(confidence_score);
CREATE INDEX IF NOT EXISTS idx_advanced_linguistics_created ON advanced_linguistics_analysis(created_at);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_advanced_linguistics_psychological ON advanced_linguistics_analysis USING GIN(psychological_profile);
CREATE INDEX IF NOT EXISTS idx_advanced_linguistics_sales ON advanced_linguistics_analysis USING GIN(sales_insights);

-- Insert comprehensive sample data for advanced linguistics analysis
INSERT INTO advanced_linguistics_analysis (
  id,
  call_id,
  transcript,
  overall_sentiment,
  confidence_score,
  psychological_profile,
  conversation_dynamics,
  power_analysis,
  sales_insights,
  key_moments,
  coaching_opportunities
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM call_analysis LIMIT 1), -- Use existing call analysis ID
  '[00:00:15] Rep: Good morning Dr. Johnson, thank you for taking the time to speak with me today. I wanted to follow up on our conversation about the new laser technology for your practice.

[00:00:32] Dr. Johnson: Yes, hello. I have to say, I''ve been thinking about our last discussion quite a bit. The technology sounds impressive, but I''m still concerned about the investment required.

[00:01:05] Rep: I completely understand your concern about the investment, Dr. Johnson. Many of our most successful practices had similar initial concerns. What I''d like to do is show you some concrete ROI data from practices similar to yours. Would that be helpful?

[00:01:18] Dr. Johnson: That would be very helpful, yes. I''m particularly interested in seeing real numbers from aesthetic practices in my market area.

[00:01:35] Rep: Perfect. I have data from three practices within 15 miles of your location. On average, they''ve seen a 35% increase in treatment revenue within the first six months. Dr. Martinez at Coastal Aesthetics mentioned that the technology paid for itself in just four months.

[00:02:02] Dr. Johnson: That''s impressive. What about the learning curve? My staff is concerned about training time.

[00:02:15] Rep: Great question. The system is designed to be intuitive. We provide comprehensive training - typically 2 days onsite, plus ongoing virtual support. Most practices are fully operational within a week. Dr. Martinez actually said her staff was more confident with this system than their previous technology.

[00:02:45] Dr. Johnson: The training sounds reasonable. I''m also curious about maintenance and support. What happens if something goes wrong?

[00:03:02] Rep: We provide 24/7 technical support and our average response time is under 2 hours. We also include preventive maintenance as part of the service agreement. In the rare case of equipment issues, we have loaner units available within 24 hours.

[00:03:25] Dr. Johnson: That''s reassuring. You know, I''m starting to see how this could work for us. When would be the earliest we could have this installed?

[00:03:38] Rep: I''m glad to hear your interest! We have availability in our next installation cycle, which would be approximately 3-4 weeks from contract signing. Would that timeline work with your practice schedule?

[00:03:55] Dr. Johnson: Yes, that could work well actually. We have a slower period coming up that would be perfect for training and implementation. What would be the next steps?

[00:04:12] Rep: Excellent! I''d like to schedule a brief demonstration at your practice next week, where you and your staff can see the technology in action. Then we can finalize the details and move forward with the installation timeline. How does Tuesday or Wednesday work for you?

[00:04:32] Dr. Johnson: Wednesday afternoon would be perfect. Let''s say 2 PM?

[00:04:38] Rep: Wednesday at 2 PM it is. I''ll bring Dr. Martinez''s case study and some additional ROI projections specific to your practice size. Dr. Johnson, I''m excited about the potential for your practice with this technology.

[00:04:55] Dr. Johnson: Thank you. I''m looking forward to seeing it in action. This conversation has been very helpful in addressing my concerns.',
  'positive',
  92.5,
  '{
    "personalityType": "analytical",
    "decisionMakingStyle": "deliberate", 
    "communicationStyle": "formal",
    "riskTolerance": "medium",
    "pricesensitivity": "medium",
    "trustFactors": ["Social Proof", "Local References", "Risk Reduction", "Expert Authority"],
    "motivationalTriggers": ["ROI Data", "Peer Success Stories", "Risk Mitigation", "Timeline Clarity"],
    "concernsAndObjections": ["Investment Cost", "Staff Training", "Technical Support", "Implementation Timeline"]
  }'::jsonb,
  '{
    "talkTimeRatio": {"rep": 65, "prospect": 35},
    "interruptionPattern": {"repInterruptions": 1, "prospectInterruptions": 2},
    "questioningTechnique": {"openQuestions": 8, "closedQuestions": 3, "leadingQuestions": 2},
    "silenceMoments": [
      {"duration": 3, "context": "After price mention", "effectiveness": "positive"},
      {"duration": 2, "context": "Before objection response", "effectiveness": "neutral"}
    ],
    "emotionalFlow": [
      {"timestamp": "00:00:32", "emotion": "concern", "intensity": 6, "speaker": "prospect"},
      {"timestamp": "00:01:35", "emotion": "interest", "intensity": 7, "speaker": "prospect"},
      {"timestamp": "00:03:25", "emotion": "confidence", "intensity": 8, "speaker": "prospect"},
      {"timestamp": "00:04:55", "emotion": "excitement", "intensity": 8, "speaker": "prospect"}
    ]
  }'::jsonb,
  '{
    "overallPowerDynamic": "balanced",
    "controlMoments": [
      {"timestamp": "00:01:05", "controlShift": "to_rep", "trigger": "ROI data offer", "impact": "high"},
      {"timestamp": "00:02:02", "controlShift": "to_prospect", "trigger": "Training concern", "impact": "medium"},
      {"timestamp": "00:03:25", "controlShift": "to_rep", "trigger": "Support assurance", "impact": "high"}
    ],
    "influenceTechniques": {
      "reciprocity": 7,
      "commitment": 9,
      "socialProof": 9,
      "authority": 8,
      "liking": 7,
      "scarcity": 6
    },
    "persuasionEffectiveness": 85
  }'::jsonb,
  '{
    "callStage": "closing",
    "buyingSignals": [
      {"signal": "Asked about installation timeline", "strength": "strong", "timestamp": "00:03:38"},
      {"signal": "Mentioned practice schedule alignment", "strength": "strong", "timestamp": "00:03:55"},
      {"signal": "Requested demonstration", "strength": "strong", "timestamp": "00:04:12"},
      {"signal": "Confirmed meeting availability", "strength": "strong", "timestamp": "00:04:32"}
    ],
    "objections": [
      {"type": "price", "content": "concerned about the investment required", "handled": true, "effectiveness": 90},
      {"type": "time", "content": "staff training concerns", "handled": true, "effectiveness": 85},
      {"type": "trust", "content": "maintenance and support concerns", "handled": true, "effectiveness": 95}
    ],
    "nextBestActions": [
      "Confirm Wednesday 2 PM demonstration appointment",
      "Prepare Dr. Martinez case study and practice-specific ROI projections", 
      "Coordinate with installation team for 3-4 week timeline",
      "Send follow-up email with meeting confirmation and agenda"
    ],
    "winProbability": 88,
    "recommendedFollowUp": {
      "timing": "Within 24 hours",
      "approach": "Confirmation email with demonstration agenda",
      "keyPoints": ["Meeting confirmation", "ROI projections", "Installation timeline", "Support details"]
    }
  }'::jsonb,
  '[
    {"timestamp": "00:01:05", "moment": "Offered concrete ROI data", "significance": "critical", "recommendation": "Continue leading with data-driven value propositions"},
    {"timestamp": "00:01:35", "moment": "Provided local market references", "significance": "critical", "recommendation": "Always use geographically relevant case studies"},
    {"timestamp": "00:02:45", "moment": "Proactively addressed support concerns", "significance": "important", "recommendation": "Anticipate and address common objections before they become barriers"},
    {"timestamp": "00:03:25", "moment": "Prospect expressed buying intent", "significance": "critical", "recommendation": "Recognize buying signals and move to next steps immediately"},
    {"timestamp": "00:04:12", "moment": "Successfully moved to concrete next steps", "significance": "critical", "recommendation": "Always end with specific, time-bound commitments"}
  ]'::jsonb,
  '[
    {"area": "Objection Handling", "currentLevel": 90, "improvement": "Excellent proactive objection handling demonstrated", "priority": "low"},
    {"area": "Social Proof Usage", "currentLevel": 95, "improvement": "Outstanding use of local references and case studies", "priority": "low"},
    {"area": "Closing Technique", "currentLevel": 85, "improvement": "Strong natural progression to next steps", "priority": "medium"},
    {"area": "Question Strategy", "currentLevel": 80, "improvement": "Good balance of open and closed questions, continue to let prospect talk", "priority": "medium"},
    {"area": "Value Communication", "currentLevel": 88, "improvement": "Excellent ROI focus, maintain data-driven approach", "priority": "low"}
  ]'::jsonb
),
(
  gen_random_uuid(),
  (SELECT id FROM call_analysis ORDER BY created_at DESC LIMIT 1 OFFSET 1), -- Use second call analysis ID
  '[00:00:10] Rep: Hi Dr. Williams, thanks for taking my call. I wanted to discuss the dental equipment upgrade we talked about last month.

[00:00:18] Dr. Williams: Oh yes, right. Look, I''m really busy today. Can we make this quick?

[00:00:25] Rep: Of course, I understand your time is valuable. I just wanted to quickly go over the pricing options we discussed.

[00:00:35] Dr. Williams: Pricing... yes, that was my main concern. The numbers you showed me last time were quite high.

[00:00:45] Rep: I understand the investment seems significant. However, when you consider the increased efficiency and patient throughput...

[00:00:55] Dr. Williams: [interrupting] Look, I''ve been in practice for 20 years. I know what works for my patients. I''m not convinced this new technology is necessary.

[00:01:08] Rep: I respect your experience, Dr. Williams. Many experienced practitioners have found that this technology actually enhances their existing skills rather than replacing them.

[00:01:20] Dr. Williams: That may be, but the cost is still a major factor. We''re not seeing the patient volume we used to.

[00:01:32] Rep: I understand the volume concerns. Actually, several practices have reported that the advanced imaging capabilities help them identify treatment opportunities they might have missed before.

[00:01:48] Dr. Williams: Hmm. I suppose that could be beneficial. But what about training? My staff is already stretched thin.

[00:01:58] Rep: The training is actually quite streamlined. Most staff members are comfortable with the system after just one day of training.

[00:02:08] Dr. Williams: One day? That seems optimistic.

[00:02:15] Rep: I understand your skepticism. Would it help if I arranged for you to speak with Dr. Thompson? He had similar concerns but found the transition smoother than expected.

[00:02:28] Dr. Williams: Dr. Thompson from Westside Dental? He''s using this equipment?

[00:02:35] Rep: Yes, he''s been using it for about eight months now. He mentioned that it''s helped him increase treatment acceptance rates significantly.

[00:02:48] Dr. Williams: Interesting. I respect Tom''s opinion. Maybe I should talk to him.

[00:02:55] Rep: I''d be happy to arrange that conversation. In the meantime, would you be open to a brief demonstration at your practice?

[00:03:05] Dr. Williams: I''m not sure about a demonstration right now. Let me talk to Tom first and see what he says.

[00:03:15] Rep: That makes perfect sense. I''ll reach out to Dr. Thompson today and see when he might be available for a call. How does early next week sound for following up with you?

[00:03:28] Dr. Williams: Next week should be fine. But I want to be clear - I''m still not convinced this is right for my practice.

[00:03:38] Rep: I completely understand, Dr. Williams. My goal is just to ensure you have all the information you need to make the best decision for your practice.

[00:03:48] Dr. Williams: Alright, I appreciate that approach. Let''s see what Tom has to say.

[00:03:55] Rep: Perfect. I''ll coordinate with Dr. Thompson and follow up with you early next week. Thank you for your time today.

[00:04:05] Dr. Williams: Okay, talk to you next week.',
  'neutral',
  78.3,
  '{
    "personalityType": "driver",
    "decisionMakingStyle": "deliberate",
    "communicationStyle": "direct", 
    "riskTolerance": "low",
    "pricesensitivity": "high",
    "trustFactors": ["Peer Opinions", "Experience Validation", "Proven Results"],
    "motivationalTriggers": ["Efficiency", "ROI", "Peer Success"],
    "concernsAndObjections": ["High Cost", "Technology Necessity", "Staff Training Time", "Practice Volume Issues"]
  }'::jsonb,
  '{
    "talkTimeRatio": {"rep": 58, "prospect": 42},
    "interruptionPattern": {"repInterruptions": 0, "prospectInterruptions": 1},
    "questioningTechnique": {"openQuestions": 4, "closedQuestions": 6, "leadingQuestions": 3},
    "silenceMoments": [
      {"duration": 2, "context": "After price objection", "effectiveness": "negative"},
      {"duration": 1, "context": "Before peer reference", "effectiveness": "neutral"}
    ],
    "emotionalFlow": [
      {"timestamp": "00:00:18", "emotion": "impatient", "intensity": 7, "speaker": "prospect"},
      {"timestamp": "00:00:55", "emotion": "resistance", "intensity": 8, "speaker": "prospect"},
      {"timestamp": "00:02:28", "emotion": "interest", "intensity": 5, "speaker": "prospect"},
      {"timestamp": "00:02:48", "emotion": "curiosity", "intensity": 6, "speaker": "prospect"}
    ]
  }'::jsonb,
  '{
    "overallPowerDynamic": "prospect_dominant",
    "controlMoments": [
      {"timestamp": "00:00:18", "controlShift": "to_prospect", "trigger": "Time pressure", "impact": "medium"},
      {"timestamp": "00:00:55", "controlShift": "to_prospect", "trigger": "Experience assertion", "impact": "high"},
      {"timestamp": "00:02:15", "controlShift": "to_rep", "trigger": "Peer reference offer", "impact": "medium"}
    ],
    "influenceTechniques": {
      "reciprocity": 4,
      "commitment": 3,
      "socialProof": 8,
      "authority": 5,
      "liking": 6,
      "scarcity": 2
    },
    "persuasionEffectiveness": 45
  }'::jsonb,
  '{
    "callStage": "discovery",
    "buyingSignals": [
      {"signal": "Asked about Dr. Thompson reference", "strength": "medium", "timestamp": "00:02:28"},
      {"signal": "Expressed interest in peer conversation", "strength": "medium", "timestamp": "00:02:48"}
    ],
    "objections": [
      {"type": "price", "content": "numbers you showed me last time were quite high", "handled": false, "effectiveness": 30},
      {"type": "need", "content": "not convinced this new technology is necessary", "handled": false, "effectiveness": 25},
      {"type": "time", "content": "staff is already stretched thin", "handled": false, "effectiveness": 40}
    ],
    "nextBestActions": [
      "Coordinate peer reference call with Dr. Thompson",
      "Prepare cost-benefit analysis specific to practice volume concerns",
      "Research Dr. Williams practice demographics and volume data",
      "Develop training timeline that minimizes staff disruption"
    ],
    "winProbability": 35,
    "recommendedFollowUp": {
      "timing": "Early next week after peer reference",
      "approach": "Follow-up on peer conversation outcomes",
      "keyPoints": ["Dr. Thompson insights", "Address specific cost concerns", "Flexible training options"]
    }
  }'::jsonb,
  '[
    {"timestamp": "00:00:25", "moment": "Rushed into pricing discussion", "significance": "important", "recommendation": "Build more rapport before discussing investment"},
    {"timestamp": "00:00:55", "moment": "Prospect asserted experience-based resistance", "significance": "critical", "recommendation": "Acknowledge experience more thoroughly before presenting benefits"},
    {"timestamp": "00:02:15", "moment": "Offered peer reference", "significance": "critical", "recommendation": "Lead with peer validation for experienced practitioners"},
    {"timestamp": "00:03:28", "moment": "Prospect remained uncommitted", "significance": "important", "recommendation": "Need stronger value proposition and objection handling"}
  ]'::jsonb,
  '[
    {"area": "Rapport Building", "currentLevel": 45, "improvement": "Spend more time building relationship before business discussion", "priority": "high"},
    {"area": "Objection Handling", "currentLevel": 35, "improvement": "Address price and necessity objections more thoroughly", "priority": "high"},
    {"area": "Value Communication", "currentLevel": 50, "improvement": "Better articulate specific benefits for experienced practitioners", "priority": "high"},
    {"area": "Social Proof Strategy", "currentLevel": 75, "improvement": "Good use of peer references, continue this approach", "priority": "medium"},
    {"area": "Call Control", "currentLevel": 40, "improvement": "Regain control when prospect dominates conversation", "priority": "high"}
  ]'::jsonb
);

-- Create trigger for updated_at
CREATE TRIGGER update_advanced_linguistics_analysis_updated_at 
    BEFORE UPDATE ON advanced_linguistics_analysis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for analytics reporting
CREATE OR REPLACE VIEW linguistics_performance_metrics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    overall_sentiment,
    AVG(confidence_score) as avg_confidence,
    AVG((sales_insights->>'winProbability')::int) as avg_win_probability,
    AVG((power_analysis->>'persuasionEffectiveness')::int) as avg_persuasion_effectiveness,
    COUNT(*) as total_analyses
FROM advanced_linguistics_analysis 
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at), overall_sentiment
ORDER BY month DESC, overall_sentiment;

-- Create function to get coaching insights
CREATE OR REPLACE FUNCTION get_coaching_insights(
    rep_id UUID DEFAULT NULL,
    time_period INTERVAL DEFAULT INTERVAL '30 days'
)
RETURNS TABLE (
    coaching_area TEXT,
    avg_score DECIMAL(5,2),
    improvement_areas TEXT[],
    priority_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        opportunity->>'area' as coaching_area,
        AVG((opportunity->>'currentLevel')::decimal) as avg_score,
        ARRAY_AGG(DISTINCT opportunity->>'improvement') as improvement_areas,
        CASE 
            WHEN AVG((opportunity->>'currentLevel')::decimal) < 50 THEN 'high'
            WHEN AVG((opportunity->>'currentLevel')::decimal) < 75 THEN 'medium'
            ELSE 'low'
        END as priority_level
    FROM advanced_linguistics_analysis,
         jsonb_array_elements(coaching_opportunities) as opportunity
    WHERE created_at >= CURRENT_DATE - time_period
    GROUP BY opportunity->>'area'
    ORDER BY avg_score ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get sentiment trends
CREATE OR REPLACE FUNCTION get_advanced_sentiment_trends(
    time_period INTERVAL DEFAULT INTERVAL '90 days'
)
RETURNS TABLE (
    week_start DATE,
    positive_calls BIGINT,
    neutral_calls BIGINT,
    negative_calls BIGINT,
    avg_win_probability DECIMAL(5,2),
    avg_persuasion_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('week', created_at)::date as week_start,
        COUNT(*) FILTER (WHERE overall_sentiment = 'positive') as positive_calls,
        COUNT(*) FILTER (WHERE overall_sentiment = 'neutral') as neutral_calls,
        COUNT(*) FILTER (WHERE overall_sentiment = 'negative') as negative_calls,
        AVG((sales_insights->>'winProbability')::decimal) as avg_win_probability,
        AVG((power_analysis->>'persuasionEffectiveness')::decimal) as avg_persuasion_score
    FROM advanced_linguistics_analysis
    WHERE created_at >= CURRENT_DATE - time_period
    GROUP BY DATE_TRUNC('week', created_at)
    ORDER BY week_start DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to analyze personality types distribution
CREATE OR REPLACE FUNCTION get_personality_distribution()
RETURNS TABLE (
    personality_type TEXT,
    count BIGINT,
    avg_win_rate DECIMAL(5,2),
    common_triggers TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        psychological_profile->>'personalityType' as personality_type,
        COUNT(*) as count,
        AVG((sales_insights->>'winProbability')::decimal) as avg_win_rate,
        ARRAY_AGG(DISTINCT trigger) as common_triggers
    FROM advanced_linguistics_analysis,
         jsonb_array_elements_text(psychological_profile->'motivationalTriggers') as trigger
    WHERE psychological_profile->>'personalityType' IS NOT NULL
    GROUP BY psychological_profile->>'personalityType'
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;