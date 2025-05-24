// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates mock linguistics analysis data for testing
 * @param count Number of mock linguistics analysis records to generate
 * @returns Array of mock linguistics analysis records
 */
export const generateMockLinguisticsAnalysis = (count: number = 20) => {
  return Array.from({ length: count }, (_, i) => {
    const id = uuidv4();
    const callId = uuidv4();
    
    return {
      id,
      title: `Call Analysis ${i + 1}`,
      audio_url: `https://example.com/recordings/${id}.mp3`,
      transcript: `This is a sample transcript for call ${i + 1}. It contains various discussion points about products, pricing, and next steps.`,
      analysis_result: {
        language_metrics: {
          speaking_pace: Math.floor(Math.random() * 50 + 120), // words per minute
          talk_to_listen_ratio: Math.random() * 2, // ratio
          filler_word_frequency: Math.random() * 0.2, // percentage
          technical_language_level: Math.floor(Math.random() * 10), // scale 1-10
          interruption_count: Math.floor(Math.random() * 5), // count
          average_response_time: Math.random() * 3 // seconds
        },
        topic_segments: [
          {
            topic: 'Product Introduction',
            start_time: 0,
            end_time: 120,
            keywords: ['product', 'features', 'benefits'],
            summary: 'Introduction to product features and benefits'
          },
          {
            topic: 'Pricing Discussion',
            start_time: 121,
            end_time: 240,
            keywords: ['price', 'discount', 'offer'],
            summary: 'Discussion about pricing and potential discounts'
          },
          {
            topic: 'Next Steps',
            start_time: 241,
            end_time: 300,
            keywords: ['follow-up', 'demo', 'meeting'],
            summary: 'Planning next steps and follow-up actions'
          }
        ],
        action_items: [
          {
            description: 'Send product brochure',
            timestamp: 65,
            priority: 'high',
            status: 'pending'
          },
          {
            description: 'Schedule follow-up call',
            timestamp: 245,
            priority: 'medium',
            status: 'pending'
          }
        ]
      },
      sentiment_score: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 to 1
      key_phrases: ['product', 'pricing', 'follow-up', 'demo', 'features'],
      status: 'completed',
      call_id: callId,
      source_type: 'twilio',
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
      updated_at: new Date().toISOString()
    };
  });
};

/**
 * Generates mock call analysis data with linked linguistics analysis
 * @param count Number of mock call analysis records to generate
 * @returns Array of mock call analysis records with linguistics data
 */
export const generateMockCallAnalysisWithLinguistics = (count: number = 20) => {
  const linguisticsData = generateMockLinguisticsAnalysis(count);
  
  return linguisticsData.map((linguistics, i) => {
    return {
      id: linguistics.call_id, // Use the call_id from linguistics as the call analysis id
      call_sid: `CA${Math.random().toString(36).substring(2, 15)}`,
      call_duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes
      call_date: linguistics.created_at,
      call_type: Math.random() > 0.5 ? 'inbound' : 'outbound',
      contact_id: uuidv4(),
      contact_name: `Contact ${i + 1}`,
      practice_id: uuidv4(),
      practice_name: `Practice ${i + 1}`,
      recording_url: linguistics.audio_url,
      notes: `Notes for call ${i + 1}`,
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
export const enhanceMockDataWithLinguistics = (mockData: Record<string, any[]>) => {
  const linguisticsAnalysis = generateMockLinguisticsAnalysis(20);
  const callAnalysis = generateMockCallAnalysisWithLinguistics(20);
  
  return {
    ...mockData,
    linguistics_analysis: linguisticsAnalysis,
    call_analysis: callAnalysis
  };
};
