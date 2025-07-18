import { supabase } from '../supabase/supabase';

// Twilio Recording Types
interface TwilioRecording {
  sid: string;
  accountSid: string;
  callSid: string;
  uri: string;
  dateCreated: string;
  dateUpdated: string;
  duration: string;
  status: 'processing' | 'completed' | 'absent' | 'failed';
  channels: number;
  source: 'DialVerb' | 'Conference' | 'OutboundAPI' | 'Trunking' | 'RecordVerb';
}

// AI Transcription Types
interface TranscriptionSegment {
  speaker: 'rep' | 'customer' | 'unknown';
  text: string;
  confidence: number;
  start_time: number;
  end_time: number;
  sentiment?: string;
  keywords?: string[];
}

interface CallAnalysis {
  overall_sentiment: number;
  customer_satisfaction: number;
  conversion_likelihood: number;
  key_topics: string[];
  action_items: string[];
  concerns_raised: string[];
  positive_signals: string[];
  coaching_suggestions: string[];
  call_quality_score: number;
}

interface ProcessedCall {
  call_id: string;
  recording_url: string;
  transcription_segments: TranscriptionSegment[];
  full_transcription: string;
  ai_analysis: CallAnalysis;
  processing_duration_ms: number;
  status: 'processing' | 'completed' | 'failed';
}

class CallRecordingService {
  private openaiApiKey: string;
  private twilioAccountSid: string;
  private twilioAuthToken: string;

  constructor() {
    this.openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.twilioAccountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID || '';
    this.twilioAuthToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN || '';
  }

  /**
   * Process a completed call recording
   * This is typically called from a Twilio webhook when recording is complete
   */
  async processCallRecording(callSid: string, recordingSid: string): Promise<ProcessedCall> {
    const startTime = Date.now();
    console.log(`🎬 Starting call recording processing for ${callSid}`);

    try {
      // Step 1: Get call details from database
      const callRecord = await this.getCallRecord(callSid);
      if (!callRecord) {
        throw new Error(`Call record not found for ${callSid}`);
      }

      // Step 2: Download recording from Twilio
      const recordingUrl = await this.getRecordingUrl(recordingSid);
      console.log(`📥 Retrieved recording URL: ${recordingUrl}`);

      // Step 3: Transcribe audio using OpenAI Whisper
      const transcriptionResult = await this.transcribeAudio(recordingUrl);
      console.log(`📝 Transcription completed with ${transcriptionResult.segments.length} segments`);

      // Step 4: Perform AI analysis on transcription
      const aiAnalysis = await this.analyzeTranscription(transcriptionResult.full_text, callRecord);
      console.log(`🤖 AI analysis completed with ${aiAnalysis.conversion_likelihood}% conversion likelihood`);

      // Step 5: Store results in database
      await this.storeCallAnalysis(callRecord.id, {
        recording_url: recordingUrl,
        transcription_text: transcriptionResult.full_text,
        transcription_confidence: transcriptionResult.average_confidence,
        ai_analysis: aiAnalysis,
        sentiment_score: aiAnalysis.overall_sentiment,
        keywords: aiAnalysis.key_topics,
        call_quality_score: aiAnalysis.call_quality_score,
      });

      // Step 6: Store detailed transcription segments
      await this.storeTranscriptionSegments(callRecord.id, callRecord.rep_id, transcriptionResult.segments);

      // Step 7: Update rep analytics
      await this.updateRepAnalytics(callRecord.rep_id, aiAnalysis);

      // Step 8: Generate coaching insights if needed
      if (aiAnalysis.call_quality_score < 0.7) {
        await this.generateCoachingSession(callRecord.rep_id, callRecord.id, aiAnalysis);
      }

      const processingDuration = Date.now() - startTime;
      console.log(`✅ Call processing completed in ${processingDuration}ms`);

      return {
        call_id: callRecord.id,
        recording_url: recordingUrl,
        transcription_segments: transcriptionResult.segments,
        full_transcription: transcriptionResult.full_text,
        ai_analysis: aiAnalysis,
        processing_duration_ms: processingDuration,
        status: 'completed'
      };

    } catch (error) {
      console.error(`❌ Call processing failed for ${callSid}:`, error);
      
      // Update call record with error status
      await this.updateCallStatus(callSid, 'failed', error.message);

      return {
        call_id: callSid,
        recording_url: '',
        transcription_segments: [],
        full_transcription: '',
        ai_analysis: {} as CallAnalysis,
        processing_duration_ms: Date.now() - startTime,
        status: 'failed'
      };
    }
  }

  /**
   * Get call record from database
   */
  private async getCallRecord(callSid: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('rep_call_records')
        .select('*')
        .eq('call_sid', callSid)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get call record:', error);
      throw error;
    }
  }

  /**
   * Get recording download URL from Twilio
   */
  private async getRecordingUrl(recordingSid: string): Promise<string> {
    try {
      // In production, this would use the actual Twilio SDK
      // For now, we'll return a mock URL
      return `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Recordings/${recordingSid}.wav`;
    } catch (error) {
      console.error('Failed to get recording URL:', error);
      throw error;
    }
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  private async transcribeAudio(audioUrl: string): Promise<{
    full_text: string;
    segments: TranscriptionSegment[];
    average_confidence: number;
  }> {
    try {
      // Mock transcription for development
      const mockSegments: TranscriptionSegment[] = [
        {
          speaker: 'rep',
          text: 'Hi Dr. Johnson, this is Sarah from RepSpheres. I wanted to follow up on our conversation about the new laser equipment.',
          confidence: 0.95,
          start_time: 0.0,
          end_time: 8.5,
          sentiment: 'neutral',
          keywords: ['laser equipment', 'follow up']
        },
        {
          speaker: 'customer',
          text: 'Oh yes, I\'ve been thinking about it. The pricing seemed quite competitive, but I\'m still concerned about the training requirements.',
          confidence: 0.92,
          start_time: 9.0,
          end_time: 18.2,
          sentiment: 'neutral',
          keywords: ['pricing', 'competitive', 'training', 'concerned']
        },
        {
          speaker: 'rep',
          text: 'I completely understand that concern. We actually include comprehensive training as part of the package, and our team can be on-site within 48 hours of installation.',
          confidence: 0.94,
          start_time: 19.0,
          end_time: 29.5,
          sentiment: 'positive',
          keywords: ['training', 'package', 'on-site', 'installation']
        },
        {
          speaker: 'customer',
          text: 'That sounds much better. What about ongoing support? We\'ve had issues with our current supplier taking weeks to respond.',
          confidence: 0.91,
          start_time: 30.0,
          end_time: 38.8,
          sentiment: 'interested',
          keywords: ['ongoing support', 'current supplier', 'response time']
        }
      ];

      const fullText = mockSegments.map(s => `${s.speaker.toUpperCase()}: ${s.text}`).join('\n');
      const avgConfidence = mockSegments.reduce((acc, s) => acc + s.confidence, 0) / mockSegments.length;

      return {
        full_text: fullText,
        segments: mockSegments,
        average_confidence: avgConfidence
      };

      // In production, this would call OpenAI Whisper API:
      /*
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData // Audio file + model parameters
      });
      */

    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      throw error;
    }
  }

  /**
   * Analyze transcription using AI to extract insights
   */
  private async analyzeTranscription(transcription: string, callRecord: any): Promise<CallAnalysis> {
    try {
      // Mock AI analysis for development
      const mockAnalysis: CallAnalysis = {
        overall_sentiment: 0.7,
        customer_satisfaction: 0.75,
        conversion_likelihood: 85,
        key_topics: ['laser equipment', 'pricing', 'training', 'support', 'installation'],
        action_items: [
          'Send detailed training documentation',
          'Schedule follow-up call for next week',
          'Provide case studies from similar practices'
        ],
        concerns_raised: [
          'Training requirements complexity',
          'Previous supplier support issues'
        ],
        positive_signals: [
          'Competitive pricing acknowledged',
          'Interest in comprehensive training package',
          'Willingness to discuss next steps'
        ],
        coaching_suggestions: [
          'Address concerns more proactively',
          'Share success stories earlier in conversation',
          'Follow up on specific pain points mentioned'
        ],
        call_quality_score: 0.82
      };

      return mockAnalysis;

      // In production, this would use OpenAI GPT API for analysis:
      /*
      const prompt = `
        Analyze this sales call transcription and provide insights:
        
        ${transcription}
        
        Provide analysis in the following JSON format:
        {
          "overall_sentiment": <0-1 score>,
          "customer_satisfaction": <0-1 score>,
          "conversion_likelihood": <0-100 percentage>,
          "key_topics": ["topic1", "topic2"],
          "action_items": ["action1", "action2"],
          "concerns_raised": ["concern1", "concern2"],
          "positive_signals": ["signal1", "signal2"],
          "coaching_suggestions": ["suggestion1", "suggestion2"],
          "call_quality_score": <0-1 score>
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });
      */

    } catch (error) {
      console.error('Failed to analyze transcription:', error);
      throw error;
    }
  }

  /**
   * Store call analysis results in database
   */
  private async storeCallAnalysis(callId: string, analysisData: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('rep_call_records')
        .update({
          ...analysisData,
          updated_at: new Date().toISOString()
        })
        .eq('id', callId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to store call analysis:', error);
      throw error;
    }
  }

  /**
   * Store detailed transcription segments
   */
  private async storeTranscriptionSegments(callId: string, repId: string, segments: TranscriptionSegment[]): Promise<void> {
    try {
      const segmentRecords = segments.map(segment => ({
        call_id: callId,
        rep_id: repId,
        speaker: segment.speaker,
        text: segment.text,
        confidence: segment.confidence,
        start_time: segment.start_time,
        end_time: segment.end_time,
        sentiment: segment.sentiment,
        keywords: segment.keywords || [],
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('call_transcription_segments')
        .insert(segmentRecords);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to store transcription segments:', error);
      throw error;
    }
  }

  /**
   * Update rep analytics with new call data
   */
  private async updateRepAnalytics(repId: string, analysis: CallAnalysis): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get existing analytics for today
      const { data: existing } = await supabase
        .from('rep_analytics')
        .select('*')
        .eq('rep_id', repId)
        .eq('date', today)
        .single();

      const updatedStats = {
        daily_stats: {
          calls_made: (existing?.daily_stats?.calls_made || 0) + 1,
          avg_sentiment: analysis.overall_sentiment,
          avg_conversion_likelihood: analysis.conversion_likelihood,
          total_call_quality: (existing?.daily_stats?.total_call_quality || 0) + analysis.call_quality_score,
        },
        performance_metrics: {
          key_topics_discussed: [...(existing?.performance_metrics?.key_topics_discussed || []), ...analysis.key_topics],
          common_concerns: [...(existing?.performance_metrics?.common_concerns || []), ...analysis.concerns_raised],
          coaching_opportunities: analysis.coaching_suggestions,
        }
      };

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('rep_analytics')
          .update({
            ...updatedStats,
            updated_at: new Date().toISOString()
          })
          .eq('rep_id', repId)
          .eq('date', today);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('rep_analytics')
          .insert([{
            rep_id: repId,
            date: today,
            ...updatedStats,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Failed to update rep analytics:', error);
      throw error;
    }
  }

  /**
   * Generate coaching session for low-quality calls
   */
  private async generateCoachingSession(repId: string, callId: string, analysis: CallAnalysis): Promise<void> {
    try {
      const coachingSession = {
        rep_id: repId,
        session_type: 'auto-analysis',
        call_ids: [callId],
        strengths: analysis.positive_signals,
        improvement_areas: analysis.coaching_suggestions,
        action_items: analysis.action_items,
        overall_score: analysis.call_quality_score,
        coach_notes: `Automated analysis identified areas for improvement. Call quality score: ${(analysis.call_quality_score * 100).toFixed(1)}%`,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('rep_coaching_sessions')
        .insert([coachingSession]);

      if (error) throw error;

      console.log(`🎯 Generated coaching session for rep ${repId}`);
    } catch (error) {
      console.error('Failed to generate coaching session:', error);
      // Don't throw - coaching is not critical
    }
  }

  /**
   * Update call status in database
   */
  private async updateCallStatus(callSid: string, status: string, errorMessage?: string): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (errorMessage) {
        updateData.notes = errorMessage;
      }

      const { error } = await supabase
        .from('rep_call_records')
        .update(updateData)
        .eq('call_sid', callSid);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update call status:', error);
    }
  }

  /**
   * Get call transcription and analysis
   */
  async getCallAnalysis(callId: string): Promise<{
    transcription: TranscriptionSegment[];
    analysis: CallAnalysis;
    recording_url?: string;
  } | null> {
    try {
      // Get call record
      const { data: callRecord, error: callError } = await supabase
        .from('rep_call_records')
        .select('*')
        .eq('id', callId)
        .single();

      if (callError) throw callError;

      // Get transcription segments
      const { data: segments, error: segmentsError } = await supabase
        .from('call_transcription_segments')
        .select('*')
        .eq('call_id', callId)
        .order('start_time');

      if (segmentsError) throw segmentsError;

      return {
        transcription: segments || [],
        analysis: callRecord.ai_analysis || {},
        recording_url: callRecord.recording_url
      };
    } catch (error) {
      console.error('Failed to get call analysis:', error);
      return null;
    }
  }

  /**
   * Get rep call analytics summary
   */
  async getRepCallSummary(repId: string, dateRange?: { start: string; end: string }): Promise<{
    total_calls: number;
    avg_quality_score: number;
    avg_conversion_likelihood: number;
    top_topics: string[];
    common_concerns: string[];
    recent_coaching_suggestions: string[];
  }> {
    try {
      let query = supabase
        .from('rep_call_records')
        .select('ai_analysis, call_quality_score, created_at')
        .eq('rep_id', repId);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data: calls, error } = await query;

      if (error) throw error;

      const validCalls = calls?.filter(call => call.ai_analysis) || [];
      
      const summary = {
        total_calls: validCalls.length,
        avg_quality_score: validCalls.reduce((acc, call) => acc + (call.call_quality_score || 0), 0) / validCalls.length || 0,
        avg_conversion_likelihood: validCalls.reduce((acc, call) => acc + (call.ai_analysis?.conversion_likelihood || 0), 0) / validCalls.length || 0,
        top_topics: this.extractTopItems(validCalls.map(call => call.ai_analysis?.key_topics || []).flat()),
        common_concerns: this.extractTopItems(validCalls.map(call => call.ai_analysis?.concerns_raised || []).flat()),
        recent_coaching_suggestions: this.extractTopItems(validCalls.map(call => call.ai_analysis?.coaching_suggestions || []).flat())
      };

      return summary;
    } catch (error) {
      console.error('Failed to get rep call summary:', error);
      return {
        total_calls: 0,
        avg_quality_score: 0,
        avg_conversion_likelihood: 0,
        top_topics: [],
        common_concerns: [],
        recent_coaching_suggestions: []
      };
    }
  }

  /**
   * Extract top items from array by frequency
   */
  private extractTopItems(items: string[], limit: number = 5): string[] {
    const frequency: { [key: string]: number } = {};
    
    items.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([item]) => item);
  }
}

export default new CallRecordingService();