// Twilio Call Service - Integration for call recording, transcription, and analysis
import { supabase } from './supabase/supabase';
import { logger } from '../utils/logger';

export interface TwilioCallRecord {
  id: string;
  call_sid: string;
  from_number: string;
  to_number: string;
  direction: 'inbound' | 'outbound';
  duration: number;
  status: 'completed' | 'failed' | 'in-progress' | 'queued';
  recording_url?: string;
  transcription_text?: string;
  transcription_status?: 'pending' | 'completed' | 'failed';
  user_id: string;
  contact_id?: string;
  practice_id?: string;
  created_at: string;
  updated_at: string;
  call_metadata: {
    start_time: string;
    end_time: string;
    answered_by: 'human' | 'machine' | 'unknown';
    price?: number;
    currency?: string;
  };
}

export interface CallAnalysis {
  id: string;
  call_id: string;
  analysis_type: 'sentiment' | 'objections' | 'opportunities' | 'coaching' | 'summary';
  sentiment_scores: {
    overall: number;
    positive: number;
    negative: number;
    neutral: number;
    emotions: {
      confidence: number;
      enthusiasm: number;
      frustration: number;
      confusion: number;
    };
  };
  key_moments: {
    timestamp: string;
    type: 'objection' | 'buying_signal' | 'pain_point' | 'competitor_mention' | 'pricing_discussion';
    text: string;
    confidence: number;
    suggested_response?: string;
  }[];
  topics_discussed: {
    topic: string;
    duration_seconds: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    key_points: string[];
  }[];
  objection_analysis: {
    objection: string;
    category: 'price' | 'timing' | 'authority' | 'need' | 'competitor' | 'trust';
    severity: 'low' | 'medium' | 'high';
    handled: boolean;
    suggested_handling: string;
  }[];
  opportunities_identified: {
    opportunity: string;
    confidence: number;
    recommended_action: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  coaching_insights: {
    area: string;
    performance: 'excellent' | 'good' | 'needs_improvement';
    specific_feedback: string;
    training_recommendation?: string;
  }[];
  ai_summary: string;
  next_steps: string[];
  follow_up_required: boolean;
  created_at: string;
}

export interface CallTranscriptionSegment {
  speaker: 'rep' | 'prospect';
  text: string;
  timestamp: string;
  confidence: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface TwilioConfig {
  account_sid: string;
  auth_token: string;
  phone_number: string;
  recording_callback_url: string;
  transcription_callback_url: string;
}

class TwilioCallService {
  private config: TwilioConfig | null = null;

  async initialize(config: TwilioConfig) {
    this.config = config;
    // In production, validate Twilio credentials
    logger.info('Twilio service initialized');
  }

  // Initiate an outbound call
  async makeCall(
    to: string,
    userId: string,
    contactId?: string,
    practiceId?: string
  ): Promise<TwilioCallRecord> {
    try {
      // In production, this would use Twilio SDK
      // For now, create a mock call record
      const callRecord: Partial<TwilioCallRecord> = {
        id: `call_${Date.now()}`,
        call_sid: `CA${Math.random().toString(36).substr(2, 32)}`,
        from_number: this.config?.phone_number || '+1234567890',
        to_number: to,
        direction: 'outbound',
        duration: 0,
        status: 'queued',
        user_id: userId,
        contact_id: contactId,
        practice_id: practiceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        call_metadata: {
          start_time: new Date().toISOString(),
          end_time: '',
          answered_by: 'unknown'
        }
      };

      // Save to database
      const { data, error } = await supabase
        .from('twilio_calls')
        .insert(callRecord)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error making call:', error);
      throw error;
    }
  }

  // Get call records for a user
  async getUserCalls(
    userId: string,
    filters?: {
      start_date?: string;
      end_date?: string;
      direction?: 'inbound' | 'outbound';
      status?: string;
      contact_id?: string;
      practice_id?: string;
    }
  ): Promise<TwilioCallRecord[]> {
    try {
      let query = supabase
        .from('twilio_calls')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('created_at', filters.end_date);
      }
      if (filters?.direction) {
        query = query.eq('direction', filters.direction);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.contact_id) {
        query = query.eq('contact_id', filters.contact_id);
      }
      if (filters?.practice_id) {
        query = query.eq('practice_id', filters.practice_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user calls:', error);
      throw error;
    }
  }

  // Get call analysis
  async getCallAnalysis(callId: string): Promise<CallAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('call_analysis')
        .select('*')
        .eq('call_id', callId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching call analysis:', error);
      throw error;
    }
  }

  // Analyze call transcription
  async analyzeCall(
    callId: string,
    transcription: string,
    segments?: CallTranscriptionSegment[]
  ): Promise<CallAnalysis> {
    try {
      // In production, this would use AI service for analysis
      // For now, create mock analysis
      const analysis: CallAnalysis = {
        id: `analysis_${Date.now()}`,
        call_id: callId,
        analysis_type: 'summary',
        sentiment_scores: {
          overall: 0.75,
          positive: 0.6,
          negative: 0.1,
          neutral: 0.3,
          emotions: {
            confidence: 0.8,
            enthusiasm: 0.7,
            frustration: 0.1,
            confusion: 0.2
          }
        },
        key_moments: this.extractKeyMoments(transcription, segments),
        topics_discussed: this.extractTopics(transcription, segments),
        objection_analysis: this.analyzeObjections(transcription, segments),
        opportunities_identified: this.identifyOpportunities(transcription, segments),
        coaching_insights: this.generateCoachingInsights(transcription, segments),
        ai_summary: this.generateSummary(transcription),
        next_steps: this.generateNextSteps(transcription),
        follow_up_required: true,
        created_at: new Date().toISOString()
      };

      // Save analysis to database
      const { data, error } = await supabase
        .from('call_analysis')
        .insert(analysis)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing call:', error);
      throw error;
    }
  }

  // Extract key moments from transcription
  private extractKeyMoments(
    transcription: string,
    segments?: CallTranscriptionSegment[]
  ): CallAnalysis['key_moments'] {
    const keyMoments: CallAnalysis['key_moments'] = [];

    // Mock implementation - in production would use NLP
    const objectionPhrases = [
      'too expensive',
      'not right now',
      'need to think',
      'already have',
      'not interested'
    ];

    const buyingSignalPhrases = [
      'how much',
      'when can we start',
      'what\'s next',
      'sounds good',
      'interested in'
    ];

    // Check for objections
    objectionPhrases.forEach(phrase => {
      if (transcription.toLowerCase().includes(phrase)) {
        keyMoments.push({
          timestamp: '00:00:00',
          type: 'objection',
          text: phrase,
          confidence: 0.8,
          suggested_response: this.getSuggestedResponse(phrase)
        });
      }
    });

    // Check for buying signals
    buyingSignalPhrases.forEach(phrase => {
      if (transcription.toLowerCase().includes(phrase)) {
        keyMoments.push({
          timestamp: '00:00:00',
          type: 'buying_signal',
          text: phrase,
          confidence: 0.9
        });
      }
    });

    return keyMoments;
  }

  // Extract topics from transcription
  private extractTopics(
    transcription: string,
    segments?: CallTranscriptionSegment[]
  ): CallAnalysis['topics_discussed'] {
    // Mock implementation
    const topics: CallAnalysis['topics_discussed'] = [
      {
        topic: 'Product Features',
        duration_seconds: 180,
        sentiment: 'positive',
        key_points: [
          'Discussed automation capabilities',
          'Reviewed integration options',
          'Demonstrated ROI calculator'
        ]
      },
      {
        topic: 'Pricing',
        duration_seconds: 120,
        sentiment: 'neutral',
        key_points: [
          'Presented pricing tiers',
          'Discussed volume discounts',
          'Mentioned payment terms'
        ]
      }
    ];

    return topics;
  }

  // Analyze objections
  private analyzeObjections(
    transcription: string,
    segments?: CallTranscriptionSegment[]
  ): CallAnalysis['objection_analysis'] {
    const objections: CallAnalysis['objection_analysis'] = [];

    // Mock implementation
    if (transcription.toLowerCase().includes('expensive')) {
      objections.push({
        objection: 'Price concern mentioned',
        category: 'price',
        severity: 'medium',
        handled: true,
        suggested_handling: 'Emphasize ROI and value proposition. Share case studies showing cost savings.'
      });
    }

    if (transcription.toLowerCase().includes('need to think')) {
      objections.push({
        objection: 'Decision delay',
        category: 'timing',
        severity: 'low',
        handled: false,
        suggested_handling: 'Set a specific follow-up date. Offer additional resources or trial period.'
      });
    }

    return objections;
  }

  // Identify opportunities
  private identifyOpportunities(
    transcription: string,
    segments?: CallTranscriptionSegment[]
  ): CallAnalysis['opportunities_identified'] {
    const opportunities: CallAnalysis['opportunities_identified'] = [
      {
        opportunity: 'Strong interest in automation features',
        confidence: 0.85,
        recommended_action: 'Schedule deep-dive demo focusing on automation workflows',
        priority: 'high'
      },
      {
        opportunity: 'Multiple decision makers mentioned',
        confidence: 0.7,
        recommended_action: 'Propose group presentation to full buying committee',
        priority: 'medium'
      }
    ];

    return opportunities;
  }

  // Generate coaching insights
  private generateCoachingInsights(
    transcription: string,
    segments?: CallTranscriptionSegment[]
  ): CallAnalysis['coaching_insights'] {
    const insights: CallAnalysis['coaching_insights'] = [
      {
        area: 'Discovery Questions',
        performance: 'good',
        specific_feedback: 'Good job uncovering pain points. Consider asking more about current workflow challenges.',
        training_recommendation: 'Review SPIN selling methodology for deeper discovery'
      },
      {
        area: 'Objection Handling',
        performance: 'excellent',
        specific_feedback: 'Effectively addressed pricing concerns by focusing on value and ROI.'
      }
    ];

    return insights;
  }

  // Generate AI summary
  private generateSummary(transcription: string): string {
    return `Call Summary: Discussed product capabilities with focus on automation features. 
    Prospect showed strong interest but expressed pricing concerns. Successfully demonstrated 
    ROI potential and scheduled follow-up demo for next week. Key stakeholders identified 
    for next meeting.`;
  }

  // Generate next steps
  private generateNextSteps(transcription: string): string[] {
    return [
      'Send follow-up email with ROI calculator and case studies',
      'Schedule demo for automation workflows (next Tuesday)',
      'Prepare custom pricing proposal based on discussed volumes',
      'Connect with technical team for integration requirements'
    ];
  }

  // Get suggested response for objections
  private getSuggestedResponse(objection: string): string {
    const responses: Record<string, string> = {
      'too expensive': 'I understand price is important. Let me show you how our clients typically see ROI within 3-6 months...',
      'not right now': 'I appreciate that timing is crucial. What would need to change for this to become a priority?',
      'need to think': 'Of course, this is an important decision. What specific areas would you like to think through?',
      'already have': 'That\'s great that you have a solution. How well is it addressing your current challenges?',
      'not interested': 'I understand. May I ask what led you to that conclusion? Perhaps I misunderstood your needs.'
    };

    return responses[objection] || 'Let me understand your concerns better...';
  }

  // Get call statistics
  async getCallStatistics(
    userId: string,
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'week'
  ): Promise<{
    total_calls: number;
    total_duration: number;
    avg_duration: number;
    sentiment_trend: number;
    conversion_rate: number;
    top_objections: { objection: string; count: number }[];
    coaching_areas: { area: string; score: number }[];
  }> {
    try {
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }

      // Get calls in timeframe
      const calls = await this.getUserCalls(userId, {
        start_date: startDate.toISOString(),
        end_date: now.toISOString()
      });

      // Calculate statistics
      const totalCalls = calls.length;
      const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
      const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

      // Mock data for other metrics
      return {
        total_calls: totalCalls,
        total_duration: totalDuration,
        avg_duration: avgDuration,
        sentiment_trend: 0.75,
        conversion_rate: 0.32,
        top_objections: [
          { objection: 'Price concerns', count: 15 },
          { objection: 'Timing issues', count: 8 },
          { objection: 'Need approval', count: 5 }
        ],
        coaching_areas: [
          { area: 'Discovery', score: 85 },
          { area: 'Objection Handling', score: 78 },
          { area: 'Closing', score: 72 }
        ]
      };
    } catch (error) {
      console.error('Error getting call statistics:', error);
      throw error;
    }
  }

  // Real-time call events (for WebSocket in production)
  async handleCallEvent(event: {
    type: 'ringing' | 'answered' | 'completed' | 'failed';
    call_sid: string;
    data: any;
  }) {
    try {
      // Update call status in database
      const { error } = await supabase
        .from('twilio_calls')
        .update({
          status: event.type === 'completed' ? 'completed' : event.type,
          updated_at: new Date().toISOString(),
          ...(event.type === 'completed' && {
            'call_metadata.end_time': new Date().toISOString()
          })
        })
        .eq('call_sid', event.call_sid);

      if (error) throw error;

      // Trigger analysis for completed calls
      if (event.type === 'completed' && event.data.recording_url) {
        // In production, this would trigger transcription and analysis
        logger.info('Call completed, triggering analysis...');
      }
    } catch (error) {
      logger.error('Error handling call event:', error);
    }
  }
}

export const twilioCallService = new TwilioCallService();