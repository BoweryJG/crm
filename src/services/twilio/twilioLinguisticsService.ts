/**
 * RepSpheres CRM - Twilio Linguistics Service
 * 
 * This service handles the integration between Twilio call recordings
 * and the linguistics analysis system.
 */

import { supabase } from '../supabase/supabase';
import { LinguisticsService } from '../linguistics/linguisticsService';

export class TwilioLinguisticsService {
  /**
   * Process a Twilio call recording for linguistics analysis
   */
  static async processCallRecording(
    callSid: string,
    recordingUrl: string,
    callTitle: string
  ): Promise<{ analysisId: string; callAnalysisId: string }> {
    try {
      // 1. Create linguistics analysis entry
      const { data: linguisticsData, error: linguisticsError } = await supabase
        .from('linguistics_analysis')
        .insert([{
          title: `Twilio Call: ${callTitle}`,
          audio_url: recordingUrl,
          source_type: 'twilio',
          status: 'pending'
        }])
        .select()
        .single();
        
      if (linguisticsError) {
        throw new Error(`Error creating linguistics analysis: ${linguisticsError.message}`);
      }
      
      // 2. Create or update call_analysis record
      const { data: callAnalysis, error: callError } = await supabase
        .from('call_analysis')
        .insert([{
          title: callTitle,
          call_date: new Date().toISOString(),
          duration: 0, // This would be updated with actual duration
          recording_url: recordingUrl,
          linguistics_analysis_id: linguisticsData.id
        }])
        .select()
        .single();
        
      if (callError) {
        throw new Error(`Error creating call analysis: ${callError.message}`);
      }
      
      // 3. Trigger the analysis process (this would call your OpenRouter/AI service)
      // This could be implemented as a webhook or serverless function
      
      return {
        analysisId: linguisticsData.id,
        callAnalysisId: callAnalysis.id
      };
    } catch (error) {
      console.error('Error in processCallRecording:', error);
      throw error;
    }
  }

  /**
   * Get linguistics analysis for a Twilio call
   */
  static async getLinguisticsAnalysisForCall(callSid: string): Promise<any | null> {
    try {
      // First find the call analysis record
      const { data: callAnalysis, error: callError } = await supabase
        .from('call_analysis')
        .select('linguistics_analysis_id')
        .eq('call_sid', callSid)
        .single();
      
      if (callError || !callAnalysis || !callAnalysis.linguistics_analysis_id) {
        console.error(`Error fetching linguistics analysis ID for call ${callSid}:`, callError);
        return null;
      }
      
      // Then get the linguistics analysis
      return await LinguisticsService.getAnalysisById(callAnalysis.linguistics_analysis_id);
    } catch (error) {
      console.error('Error in getLinguisticsAnalysisForCall:', error);
      return null;
    }
  }

  /**
   * Update call analysis with linguistics results
   */
  static async updateCallWithLinguisticsResults(
    callSid: string, 
    linguisticsResults: any
  ): Promise<boolean> {
    try {
      // Find the call analysis record
      const { data: callAnalysis, error: callError } = await supabase
        .from('call_analysis')
        .select('id')
        .eq('call_sid', callSid)
        .single();
      
      if (callError || !callAnalysis) {
        console.error(`Error fetching call analysis for call ${callSid}:`, callError);
        return false;
      }
      
      // Update the call analysis with results
      const { error: updateError } = await supabase
        .from('call_analysis')
        .update({
          transcript: linguisticsResults.transcript,
          summary: linguisticsResults.summary,
          sentiment_score: linguisticsResults.sentiment_score
        })
        .eq('id', callAnalysis.id);
      
      if (updateError) {
        console.error(`Error updating call analysis ${callAnalysis.id}:`, updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateCallWithLinguisticsResults:', error);
      return false;
    }
  }
}
