-- Update Dr. Greg Pedro's records with latest phone call interactions
-- This includes two calls: Jason & Dr. Pedro (short), Jason & Cindi (32 minutes)

-- First, add the short call between Jason and Dr. Pedro
INSERT INTO call_analysis (
    id,
    title,
    call_date,
    duration,
    contact_id,
    practice_id,
    transcript,
    summary,
    sentiment_score,
    tags,
    notes,
    linguistics_analysis_id
) VALUES (
    'c3d4e5f6-a7b8-9012-cdef-345678901235',
    'Post-Meeting Check-in with Dr. Pedro',
    '2025-07-15 10:15:00-04:00',
    4,
    '45678901-2345-6789-0123-456789012345', -- Dr. Pedro's contact ID
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Short call discussing Cindi''s reaction to the project. Dr. Pedro stepping into office. Discussion about AI books, partnerships, and future potential. Cindi described as "can''t fight it anymore, trusting at your word" - characterized as a victory.',
    'Brief check-in call where Jason discusses his AI book writing (26 books), the transformative potential of AI in healthcare, and confirms Cindi is on board with the project despite initial resistance.',
    0.7, -- Positive sentiment
    ARRAY['AI-transformation', 'partnership', 'Yomi-sales', 'relationship-building'],
    'KEY POINTS:
1. Jason writing multiple AI books (26 total) using ChatGPT
2. Topics: infrastructure, partnerships, selling robotic tech to dentists
3. Jason positions himself as "the transformer" for AI adoption
4. Believes this is "most powerful relationship of both our lives"
5. Cindi update: No longer fighting the project, trusting Jason
6. Dr. Pedro agrees with vision but had to step into office',
    'call-2025-07-15-pedro-jason'
);

-- Now add the extensive 32-minute call with Cindi
INSERT INTO call_analysis (
    id,
    title,
    call_date,
    duration,
    contact_id,
    practice_id,
    transcript,
    summary,
    sentiment_score,
    tags,
    notes,
    linguistics_analysis_id
) VALUES (
    'c3d4e5f6-a7b8-9012-cdef-345678901236',
    'Tense Project Status & Payment Discussion with Cindi',
    '2025-07-15 16:00:00-04:00',
    32,
    'b2c3d4e5-f6a7-8901-bcde-f23456789012', -- Cindi's contact ID
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Extended 32-minute call covering project status, payment disputes, technical details of AI chatbots, Facebook automation, and relationship tensions. Call became increasingly adversarial over payment expectations.',
    'Contentious call where Jason updates Cindi on website/AI development but faces strong pushback on timeline, deliverables, and payment. Cindi frustrated by lack of immediate ROI and existing financial pressures. Call ends with conditional agreement for $2,000 payment pending deliverables.',
    0.2, -- Negative sentiment
    ARRAY['payment-dispute', 'AI-chatbots', 'Facebook-automation', 'financial-stress', 'relationship-conflict', 'deliverables', 'trust-issues'],
    'CRITICAL RELATIONSHIP ISSUES:

1. FINANCIAL CONTEXT:
   - Practice hemorrhaging money: $40,000/month overhead
   - $16,000 payment due tomorrow (mentioned by Jason)
   - Already paid Carrillo $25,000 for unfinished website
   - BTL equipment investment with no ROI
   - Yomi equipment payments ongoing
   - Dr. Pedro paying from personal retirement account

2. PROJECT STATUS:
   - Jason claims 6 months work with Dr. Pedro
   - Only 1 month on actual website (after $2,000 payment)
   - 15 custom AI agents built but not deployed
   - Chatbot "Julie" not functional yet
   - Multiple websites built for changing partnerships
   - Gold color version created over weekend

3. TECHNICAL PROMISES:
   - Conversational AI agents with custom personalities
   - Multi-language support (auto-detection)
   - Facebook Messenger automation (unique permissions)
   - Automated lead capture and financing approval
   - Backend database system for logic
   - Integration with Cherry & CareCredit financing

4. PAYMENT DISPUTE:
   - Jason paid only $2,000 so far
   - Expects $2,000/month minimum for 3 months
   - Values work at $25,000-50,000
   - Cindi wants to see results before paying more
   - Tension over "bait and switch" - Dr. Pedro thought it was free
   - Jason becomes defensive and threatens to stop work

5. CINDI''S CONCERNS:
   - No working deliverables despite promises
   - Complete dependency on Jason for maintenance
   - Comparison to Vagaro (competitor with easy AI)
   - Worried about being "taken advantage of" again
   - Needs immediate patient revenue, not future promises

6. RELATIONSHIP DYNAMICS:
   - Jason dismissive of financial concerns
   - Cindi described as "terse" and "unappreciative"
   - Marital tension between Greg and Cindi over spending
   - Jason: "Maybe we''re not a good fit for each other"
   - Trust severely damaged by end of call

7. OUTCOME:
   - Conditional agreement for another $2,000
   - Deliverables due "by end of next week"
   - Cindi will discuss with Dr. Pedro
   - Relationship on very thin ice',
    'call-2025-07-15-cindi-jason'
);

-- Add detailed sales activity for this interaction series
INSERT INTO sales_activities (
    id,
    activity_type,
    activity_date,
    contact_id,
    practice_id,
    notes,
    created_by,
    outcome,
    follow_up_date,
    deal_value
) VALUES (
    'd4e5f6a7-b8c9-0123-defg-456789012345',
    'call',
    '2025-07-15 16:32:00-04:00',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'RELATIONSHIP CRISIS CALL - 32 minutes

SUMMARY: Project at risk due to payment disputes and unmet expectations. Cindi extremely frustrated with lack of tangible results despite promises. Jason defensive and threatening to withdraw.

KEY ISSUES:
1. Only $2,000 paid vs. Jason expecting $25,000-50,000 value
2. No functional deliverables after weeks/months of work
3. Practice losing $40,000/month - needs immediate revenue
4. Previous bad investments: Carrillo ($25,000), BTL, Yomi
5. Dr. Pedro spending retirement savings on practice

TECHNICAL STATUS:
- 15 AI chatbot personalities built but not live
- Website exists but not functional
- Facebook automation capabilities claimed but not demonstrated
- Multi-language support promised but not working
- Gold color variant created but not solving core issues

RELATIONSHIP RED FLAGS:
- Jason: "Maybe we''re not a good client for each other"
- Jason: "I''m not going to be the person that gets screwed"
- Cindi: "Bait and switch" accusation
- Trust breakdown evident throughout call

NEXT STEPS:
- Another $2,000 payment pending Dr. Pedro approval
- Deliverables promised by "end of next week"
- Relationship hanging by a thread
- High risk of project termination',
    '00000000-0000-0000-0000-000000000001',
    'at_risk',
    '2025-07-22',
    85000
);

-- Update contact records with latest insights
UPDATE contacts 
SET notes = notes || E'\n\n[2025-07-15 UPDATE]:\n' ||
    'CRITICAL STATUS: Relationship with practice at breaking point. Cindi (office manager/wife) extremely frustrated with lack of ROI and mounting financial pressure. Practice bleeding $40k/month. Lost $180k in potential implant revenue last week. Jason (sales rep) defensive and combative about payment expectations. High risk of losing account. Need immediate intervention to salvage relationship and deliver tangible value.'
WHERE id IN ('b2c3d4e5-f6a7-8901-bcde-f23456789012', '45678901-2345-6789-0123-456789012345');

-- Add sales rep performance notes
INSERT INTO sales_rep_notes (
    id,
    rep_name,
    date,
    contact_id,
    performance_score,
    strengths,
    weaknesses,
    action_items
) VALUES (
    'e5f6a7b8-c9d0-1234-efgh-567890123456',
    'Jason',
    '2025-07-15',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    4, -- Out of 10
    ARRAY[
        'Strong technical knowledge of AI and automation',
        'Passionate about long-term vision',
        'Good rapport with Dr. Pedro',
        'Creative problem-solving abilities'
    ],
    ARRAY[
        'CRITICAL: Complete lack of empathy for client financial situation',
        'Defensive and combative when questioned',
        'Over-promises and under-delivers',
        'Poor expectation management',
        'Dismissive of immediate revenue needs',
        'Threatens to end relationship when challenged',
        'No clear deliverable timeline',
        'Values features over client outcomes'
    ],
    ARRAY[
        'IMMEDIATE: Apologize to Cindi for dismissive behavior',
        'Deliver ONE working feature within 48 hours (TMJ lead capture)',
        'Create phased rollout plan with clear milestones',
        'Shift from feature-selling to problem-solving approach',
        'Tie payment to performance/results, not time',
        'Stop demanding payment until value is demonstrated',
        'Focus on quick wins to rebuild trust',
        'Regular check-ins with clear progress updates'
    ]
);