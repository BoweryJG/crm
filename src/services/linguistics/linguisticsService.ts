import { supabase } from '../supabase/supabase';
import { LinguisticsAnalysis } from '../../types';

export class LinguisticsService {
  /**
   * Get all linguistics analyses
   */
  static async getAllLinguisticsAnalyses(): Promise<LinguisticsAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching linguistics analyses: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllLinguisticsAnalyses:', error);
      return [];
    }
  }

  /**
   * Get a linguistics analysis by ID
   */
  static async getLinguisticsAnalysisById(id: string): Promise<LinguisticsAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Error fetching linguistics analysis: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getLinguisticsAnalysisById:', error);
      return null;
    }
  }

  /**
   * Create a new linguistics analysis
   */
  static async createLinguisticsAnalysis(analysis: Omit<LinguisticsAnalysis, 'id'>): Promise<LinguisticsAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .insert([analysis])
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating linguistics analysis: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createLinguisticsAnalysis:', error);
      return null;
    }
  }

  /**
   * Update a linguistics analysis
   */
  static async updateLinguisticsAnalysis(id: string, updates: Partial<LinguisticsAnalysis>): Promise<LinguisticsAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating linguistics analysis: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateLinguisticsAnalysis:', error);
      return null;
    }
  }

  /**
   * Delete a linguistics analysis
   */
  static async deleteLinguisticsAnalysis(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linguistics_analysis')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting linguistics analysis: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteLinguisticsAnalysis:', error);
      return false;
    }
  }

  /**
   * Get linguistics analyses by call ID
   */
  static async getLinguisticsAnalysesByCallId(callId: string): Promise<LinguisticsAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .select('*')
        .eq('call_id', callId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching linguistics analyses by call ID: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLinguisticsAnalysesByCallId:', error);
      return [];
    }
  }

  /**
   * Get linguistics sentiment trends
   */
  static async getSentimentTrends(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_sentiment_trends', { timeframe_param: timeframe });

      if (error) {
        throw new Error(`Error fetching sentiment trends: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSentimentTrends:', error);
      return [];
    }
  }

  /**
   * Get key phrase frequency
   */
  static async getKeyPhraseFrequency(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_key_phrase_frequency');

      if (error) {
        throw new Error(`Error fetching key phrase frequency: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getKeyPhraseFrequency:', error);
      return [];
    }
  }

  /**
   * Submit a call for linguistics analysis
   */
  static async submitCallForAnalysis(callId: string, audioUrl: string, transcript?: string): Promise<{ analysisId: string; status: string }> {
    try {
      // Create a new analysis request in the database
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .insert([
          { 
            call_id: callId, 
            audio_url: audioUrl,
            transcript: transcript,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Error submitting call for analysis: ${error.message}`);
      }

      return {
        analysisId: data.id,
        status: data.status
      };
    } catch (error) {
      console.error('Error in submitCallForAnalysis:', error);
      throw error;
    }
  }

  /**
   * Get analysis by ID
   */
  static async getAnalysisById(analysisId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .select('*, linguistics_analysis(*)')
        .eq('id', analysisId)
        .single();

      if (error) {
        throw new Error(`Error fetching analysis: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getAnalysisById:', error);
      throw error;
    }
  }

  /**
   * Get analysis status
   */
  static async getAnalysisStatus(analysisId: string): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'not_found'> {
    try {
      const { data, error } = await supabase
        .from('linguistics_analysis')
        .select('status')
        .eq('id', analysisId)
        .single();

      if (error) {
        console.error(`Error fetching analysis status: ${error.message}`);
        return 'not_found';
      }

      // Ensure the status is one of the expected values
      const status = data.status as 'pending' | 'processing' | 'completed' | 'failed';
      return status || 'not_found';
    } catch (error) {
      console.error('Error in getAnalysisStatus:', error);
      return 'not_found';
    }
  }
}
