// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates multiple mock linguistics analysis data for testing
 * @param count Number of mock linguistics analysis records to generate
 * @returns Array of mock linguistics analysis records
 */
export const generateMultipleMockLinguisticsAnalyses = (count: number = 20) => {
  return Array.from({ length: count }, (_, i) => {
    const id = uuidv4();
    const callId = uuidv4();
    const callDuration = Math.floor(Math.random() * 480 + 120); // 2-10 minutes in seconds
    
    // Generate personality types and decision styles
    const personalityTypes = ['Analytical', 'Driver', 'Amiable', 'Expressive'];
    const discProfiles = ['D', 'I', 'S', 'C', 'DI', 'DC', 'IS', 'SC'];
    const decisionStyles = ['Analytical', 'Intuitive', 'Collaborative', 'Directive', 'Consensus-driven'];
    
    return {
      id,
      call_id: callId,
      title: `Call Analysis ${i + 1}`,
      audio_url: `https://example.com/recordings/${id}.mp3`,
      transcript: `This is a sample transcript for call ${i + 1}. It contains various discussion points about products, pricing, and next steps. We also talked about competitor X and their recent product launch. The client seemed interested in our new financing options.`,
      analysis_result: {
        language_metrics: {
          speaking_pace: Math.floor(Math.random() * 50 + 120), // words per minute
          talk_to_listen_ratio: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)), // ratio (0.5 to 2.0)
          filler_word_frequency: parseFloat((Math.random() * 0.15).toFixed(2)), // percentage (0 to 0.15)
          technical_language_level: Math.floor(Math.random() * 7 + 3), // scale 3-9
          interruption_count: Math.floor(Math.random() * 5), // count
          average_response_time: parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)), // seconds (0.5 to 3.0)
          technical_terminology_accuracy: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)), // Percentage (0.7 to 1.0)
          empathy_score: Math.floor(Math.random() * 5 + 5), // Scale 5-9
          objection_handling_effectiveness: Math.floor(Math.random() * 6 + 4), // Scale 4-9
          question_quality_score: Math.floor(Math.random() * 5 + 5), // Scale 5-9
          closing_technique_effectiveness: Math.floor(Math.random() * 6 + 3) // Scale 3-8
        },
        topic_segments: [
          {
            topic: 'Product Introduction & Needs Discovery',
            start_time: 0,
            end_time: Math.floor(callDuration * 0.25),
            keywords: ['new product', 'features', 'client needs', 'pain points'],
            summary: 'Introduced the new XYZ implant system and discussed client\'s current challenges and requirements.',
            engagement_level: Math.floor(Math.random() * 4 + 6), // Scale 6-9
            objections_raised: [],
            resolved_objections: []
          },
          {
            topic: 'Solution Presentation & Value Proposition',
            start_time: Math.floor(callDuration * 0.25) + 1,
            end_time: Math.floor(callDuration * 0.5),
            keywords: ['benefits', 'ROI', 'case studies', 'differentiation'],
            summary: 'Presented how our solution addresses their needs, highlighting key benefits and ROI with case studies.',
            engagement_level: Math.floor(Math.random() * 3 + 7), // Scale 7-9
            objections_raised: ['Price seems high compared to Competitor A'],
            resolved_objections: []
          },
          {
            topic: 'Pricing & Objection Handling',
            start_time: Math.floor(callDuration * 0.5) + 1,
            end_time: Math.floor(callDuration * 0.75),
            keywords: ['cost', 'discount', 'payment terms', 'competitor A', 'implementation time'],
            summary: 'Discussed pricing details, addressed concerns about cost by emphasizing long-term value and offered flexible payment terms. Compared to Competitor A.',
            engagement_level: Math.floor(Math.random() * 4 + 5), // Scale 5-8
            objections_raised: ['Concern about implementation timeline'],
            resolved_objections: ['Price seems high compared to Competitor A']
          },
          {
            topic: 'Next Steps & Closing',
            start_time: Math.floor(callDuration * 0.75) + 1,
            end_time: callDuration,
            keywords: ['follow-up', 'proposal', 'demo', 'decision makers'],
            summary: 'Agreed on next steps: sending a detailed proposal and scheduling a follow-up demo with their clinical team.',
            engagement_level: Math.floor(Math.random() * 3 + 7), // Scale 7-9
            objections_raised: [],
            resolved_objections: ['Concern about implementation timeline']
          }
        ],
        action_items: [
          {
            description: 'Send detailed proposal for XYZ implant system',
            timestamp: Math.floor(callDuration * 0.8),
            priority: 'high',
            status: 'pending',
            category: 'proposal'
          },
          {
            description: 'Schedule follow-up demo with clinical team',
            timestamp: Math.floor(callDuration * 0.9),
            priority: 'high',
            status: 'pending',
            category: 'demo'
          },
          {
            description: 'Share case study on ROI for similar-sized practices',
            timestamp: Math.floor(callDuration * 0.4),
            priority: 'medium',
            status: 'pending',
            category: 'information'
          }
        ],
        competitive_intelligence: Math.random() > 0.5 ? [
          {
            name: 'Competitor A Dental Solutions',
            mentionedAt: [Math.floor(callDuration * 0.45), Math.floor(callDuration * 0.6)],
            differentiators: ['Superior material quality', 'Better long-term clinical outcomes', 'Comprehensive training program'],
            talkingPoints: ['Focus on total cost of ownership, not just upfront price.', 'Highlight our dedicated support and training.']
          }
        ] : [],
        opportunity_score: {
          score: Math.floor(Math.random() * 40 + 60), // Score 60-99
          factors: {
            engagement: Math.floor(Math.random() * 30 + 70),
            objection_resolution: Math.floor(Math.random() * 40 + 60),
            needs_alignment: Math.floor(Math.random() * 20 + 80),
            pricing_receptivity: Math.floor(Math.random() * 50 + 40)
          }
        },
        next_best_actions: [
          {
            title: 'Send Personalized Follow-Up Email',
            description: 'Reference key discussion points and confirm next steps. Attach the proposal and case study.',
            priority: 'high',
            timeline: 'Within 2 hours',
            actionText: 'Draft Email'
          },
          {
            title: 'Prepare for Demo',
            description: 'Customize demo script to address specific needs discussed (e.g., integration with their current PMS).',
            priority: 'medium',
            timeline: 'By EOD tomorrow',
            actionText: 'View Demo Prep Checklist'
          }
        ],
        deal_velocity: {
          averageCycle: Math.floor(Math.random() * 20 + 25), // 25-45 days
          cycleComparison: parseFloat((Math.random() * 20 - 10).toFixed(1)), // -10% to +10%
          probabilityToClose: Math.floor(Math.random() * 30 + 50), // 50-80%
          probabilityComparison: parseFloat((Math.random() * 10 - 5).toFixed(1)), // -5% to +5%
          estimatedCloseDate: new Date(Date.now() + (Math.floor(Math.random() * 30 + 15)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15-45 days from now
          stages: [
            { name: 'Discovery', percentage: 20, completed: true },
            { name: 'Proposal', percentage: 30, completed: Math.random() > 0.3 },
            { name: 'Negotiation', percentage: 25, completed: false },
            { name: 'Closed', percentage: 25, completed: false }
          ]
        },
        industry_specific: {
          treatment_plan_discussion_quality: Math.floor(Math.random() * 4 + 6), // Scale 6-9
          clinical_knowledge_accuracy: Math.floor(Math.random() * 3 + 7), // Scale 7-9
          patient_education_effectiveness: Math.floor(Math.random() * 4 + 5), // Scale 5-8
          pricing_transparency: Math.floor(Math.random() * 4 + 6), // Scale 6-9
          financing_options_coverage: Math.floor(Math.random() * 5 + 4), // Scale 4-8
          procedure_explanation_clarity: Math.floor(Math.random() * 3 + 7) // Scale 7-9
        },
        sentiment_timeline: Array.from({ length: 10 }, (_, k) => ({
          timestamp: Math.floor((k / 9) * callDuration),
          value: parseFloat((Math.random() * 1.6 - 0.8).toFixed(2)) // More varied sentiment -0.8 to 0.8
        })),
        speaking_pace_timeline: Array.from({ length: 10 }, (_, k) => ({
          timestamp: Math.floor((k / 9) * callDuration),
          value: Math.floor(Math.random() * 60 + 110) // Pace 110-170 WPM
        })),
        filler_words: [
          { word: 'um', count: Math.floor(Math.random() * 5) },
          { word: 'uh', count: Math.floor(Math.random() * 4) },
          { word: 'like', count: Math.floor(Math.random() * 6) },
          { word: 'you know', count: Math.floor(Math.random() * 3) }
        ].filter(fw => fw.count > 0)
      },
      sentiment_score: parseFloat((Math.random() * 1.0 - 0.5).toFixed(2)), // -0.5 to 0.5, more centered
      key_phrases: ['dental implants', 'pricing options', 'follow-up demo', 'Competitor A', 'patient outcomes', 'financing plans'],
      status: 'completed',
      source_type: 'twilio',
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
      updated_at: new Date().toISOString(),
      contact_name: `Dr. ${['Smith', 'Jones', 'Williams', 'Brown', 'Davis'][i % 5]}`,
      practice_name: `${['Bright Smiles Dental', 'Modern Dentistry', 'Family Dental Care', 'Advanced Dental Arts', 'Gentle Dental Center'][i % 5]}`,
      
      // New fields from the SQL schema
      persuasion_techniques: {
        reciprocity: Math.floor(Math.random() * 10) + 1,
        commitment_consistency: Math.floor(Math.random() * 10) + 1,
        social_proof: Math.floor(Math.random() * 10) + 1,
        authority: Math.floor(Math.random() * 10) + 1,
        liking: Math.floor(Math.random() * 10) + 1,
        scarcity: Math.floor(Math.random() * 10) + 1,
        techniques_used: ['Social proof', 'Authority positioning', 'Scarcity framing'].filter(() => Math.random() > 0.3)
      },
      
      sales_strategy_adherence: {
        discovery_quality: Math.floor(Math.random() * 10) + 1,
        value_proposition_clarity: Math.floor(Math.random() * 10) + 1,
        objection_handling: Math.floor(Math.random() * 10) + 1,
        closing_technique: Math.floor(Math.random() * 10) + 1,
        overall_adherence: Math.floor(Math.random() * 10) + 1,
        improvement_areas: ['Needs discovery', 'Value articulation', 'Closing technique'].filter(() => Math.random() > 0.6)
      },
      
      psychological_profile: {
        communication_style: personalityTypes[Math.floor(Math.random() * personalityTypes.length)],
        decision_drivers: ['Value', 'Innovation', 'Reliability', 'Relationship'].filter(() => Math.random() > 0.5),
        risk_tolerance: Math.floor(Math.random() * 10) + 1,
        influence_receptivity: Math.floor(Math.random() * 10) + 1
      },
      
      manipulation_detection: {
        pressure_tactics_used: Math.random() > 0.8,
        misleading_statements: Math.random() > 0.9 ? ['Exaggerated ROI claims'] : [],
        ethical_concerns: Math.random() > 0.9 ? ['High-pressure closing'] : []
      },
      
      objection_handling_analysis: {
        objections_raised: Math.floor(Math.random() * 5) + 1,
        objections_resolved: Math.floor(Math.random() * 4) + 1,
        resolution_effectiveness: Math.floor(Math.random() * 10) + 1,
        common_objections: ['Price', 'Implementation timeline', 'Integration concerns'].filter(() => Math.random() > 0.4)
      },
      
      coaching_recommendations: Math.random() > 0.3 ? 
        `Focus on improving value articulation and ROI explanation. Practice more effective discovery questions to better understand client needs. Consider using more social proof examples when discussing implementation timeline concerns.` : 
        `Strong presentation of value proposition. Continue developing objection handling skills, particularly around pricing concerns. Work on smoother transitions between discovery and solution presentation phases.`,
      
      buyer_personality_type: personalityTypes[Math.floor(Math.random() * personalityTypes.length)],
      
      trust_rapport_score: parseFloat((Math.random() * 5 + 5).toFixed(1)),
      influence_effectiveness_score: parseFloat((Math.random() * 6 + 4).toFixed(1)),
      conversation_control_score: parseFloat((Math.random() * 7 + 3).toFixed(1)),
      
      harvey_specter_analysis: Math.random() > 0.5 ? 
        `Strong command of conversation flow and effective use of strategic silence. Good leverage of competitive intelligence. Could improve closing technique with more confidence.` : 
        `Excellent rapport building and trust establishment. Needs to be more assertive when handling objections. Good use of social proof but could leverage scarcity principles more effectively.`,
      
      next_steps_generated: {
        immediate: ['Send follow-up email with proposal', 'Schedule technical demo'],
        short_term: ['Prepare ROI analysis', 'Connect with decision maker'],
        long_term: ['Quarterly business review', 'Expansion opportunity discussion']
      },
      
      buyer_disc_profile: discProfiles[Math.floor(Math.random() * discProfiles.length)],
      decision_making_style: decisionStyles[Math.floor(Math.random() * decisionStyles.length)],
      
      leverage_points: {
        identified: ['Budget timing', 'Competitive displacement opportunity', 'Pain point: current system reliability'],
        utilized: ['Budget timing', 'Pain point: current system reliability'],
        effectiveness: Math.floor(Math.random() * 10) + 1
      },
      
      power_dynamics_analysis: {
        rep_positioning: Math.floor(Math.random() * 10) + 1,
        buyer_authority: Math.floor(Math.random() * 10) + 1,
        negotiation_leverage: Math.floor(Math.random() * 10) + 1,
        power_shifts: [{
          timestamp: Math.floor(callDuration * 0.4),
          description: 'Rep gained leverage by introducing unique feature',
          impact: 'Positive'
        }]
      },
      
      emotional_intelligence_score: parseFloat((Math.random() * 4 + 6).toFixed(1)),
      closing_readiness_score: parseFloat((Math.random() * 6 + 4).toFixed(1)),
      
      competitive_positioning: {
        competitors_mentioned: ['Competitor A', 'Competitor B'].filter(() => Math.random() > 0.5),
        differentiation_clarity: Math.floor(Math.random() * 10) + 1,
        competitive_advantages_leveraged: ['Superior support', 'Better integration', 'Higher ROI'].filter(() => Math.random() > 0.4)
      },
      
      risk_assessment: {
        deal_risks: ['Budget constraints', 'Multiple decision makers', 'Competitive pressure'].filter(() => Math.random() > 0.6),
        risk_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        mitigation_strategies: ['ROI focus', 'Executive sponsorship', 'Phased implementation'].filter(() => Math.random() > 0.5)
      },
      
      recommended_follow_up_timing: ['24 hours', '3 days', '1 week', '2 weeks'][Math.floor(Math.random() * 4)],
      
      suggested_demo_focus: {
        key_features: ['Integration capabilities', 'Reporting dashboard', 'Mobile access'].filter(() => Math.random() > 0.4),
        pain_points_to_address: ['Data accuracy', 'Ease of use', 'Implementation time'].filter(() => Math.random() > 0.5),
        stakeholders_to_include: ['IT Director', 'Clinical Lead', 'Finance Manager'].filter(() => Math.random() > 0.6)
      },
      
      pricing_sensitivity_analysis: {
        price_sensitivity: Math.floor(Math.random() * 10) + 1,
        value_perception: Math.floor(Math.random() * 10) + 1,
        budget_alignment: ['Under budget', 'Within budget', 'Over budget'][Math.floor(Math.random() * 3)],
        recommended_approach: ['Value-based pricing', 'Competitive pricing', 'Tiered pricing'][Math.floor(Math.random() * 3)]
      },
      
      stakeholder_influence_map: {
        decision_makers: [{
          role: 'Practice Owner',
          influence: 'High',
          stance: ['Supportive', 'Neutral', 'Skeptical'][Math.floor(Math.random() * 3)]
        }],
        influencers: [{
          role: 'Office Manager',
          influence: 'Medium',
          stance: ['Supportive', 'Neutral', 'Skeptical'][Math.floor(Math.random() * 3)]
        }]
      },
      
      conversation_momentum_score: parseFloat((Math.random() * 6 + 4).toFixed(1)),
      
      ethical_concerns_flagged: Math.random() > 0.9 ? {
        concerns: ['Potential misrepresentation of capabilities'],
        severity: 'Low',
        recommendations: 'Review product capability claims for accuracy'
      } : {}
    };
  });
};

/**
 * Generates multiple mock call analysis data with linked linguistics analysis
 * @param count Number of mock call analysis records to generate
 * @returns Array of mock call analysis records with linguistics data
 */
export const generateMultipleMockCallAnalysesWithLinguistics = (count: number = 20) => {
  const linguisticsData = generateMultipleMockLinguisticsAnalyses(count);
  
  return linguisticsData.map((linguistics, i) => {
    return {
      id: linguistics.call_id, // Use the call_id from linguistics as the call analysis id
      call_sid: `CA${Math.random().toString(36).substring(2, 15)}`,
      call_duration: linguistics.analysis_result.topic_segments.reduce((sum, seg) => sum + (seg.end_time - seg.start_time), 0) || Math.floor(Math.random() * 600) + 120, // 2-12 minutes
      call_date: linguistics.created_at,
      call_type: Math.random() > 0.5 ? 'inbound' : 'outbound',
      contact_id: uuidv4(),
      contact_name: linguistics.contact_name, // Use from linguistics
      practice_id: uuidv4(),
      practice_name: linguistics.practice_name, // Use from linguistics
      recording_url: linguistics.audio_url,
      notes: `Notes for call with ${linguistics.contact_name} at ${linguistics.practice_name}`,
      follow_up_date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(), // Random date in next 14 days
      status: 'completed',
      linguistics_analysis_id: linguistics.id, // Link to the linguistics analysis
      created_at: linguistics.created_at,
      updated_at: linguistics.updated_at
    };
  });
};

/**
 * Enhances the mock Supabase client with linguistics data
 * @param mockData The existing mock data object
 * @returns Enhanced mock data with linguistics tables
 */
export const enhanceMockDataWithLinguistics = (_mockData?: Record<string, any[]>) => {
  // This function will now directly return the generated data arrays
  // as they are already structured correctly by the generator functions.
  // The _mockData parameter is kept for signature compatibility if it was used elsewhere,
  // but it's not strictly needed for this simplified version.
  
  const linguistics_analysis = generateMultipleMockLinguisticsAnalyses(50); // Generate a good pool of linguistics data
  const call_analysis = generateMultipleMockCallAnalysesWithLinguistics(50); // Generate call analyses linked to linguistics

  return {
    linguistics_analysis,
    call_analysis
    // If _mockData was intended to be merged, that logic would go here:
    // ..._mockData 
  };
};

// The logic for populating mockDataService should reside in mockDataService.ts
// Remove the block that tries to modify mockDataService from here.
