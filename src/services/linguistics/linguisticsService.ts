/**
 * RepSpheres CRM - Linguistics Service
 * 
 * This service interfaces with the external linguistics module at
 * https://linguistics.repspheres.com/ to provide linguistic analysis
 * of sales calls.
 */

import axios from 'axios';
import { LinguisticsAnalysis } from '../../types';

// Base URL for the linguistics API
const LINGUISTICS_API_URL = 'https://linguistics.repspheres.com/api';

/**
 * Service for linguistics analysis operations
 */
export const LinguisticsService = {
  /**
   * Get linguistics analysis for a call
   */
  async getAnalysisById(analysisId: string): Promise<LinguisticsAnalysis | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}`);
      return response.data as LinguisticsAnalysis;
    } catch (error) {
      console.error(`Error fetching linguistics analysis ${analysisId}:`, error);
      return null;
    }
  },
  
  /**
   * Submit a call recording for analysis
   */
  async submitCallForAnalysis(callId: string, recordingUrl: string, transcript?: string): Promise<{ analysisId: string } | null> {
    try {
      const response = await axios.post(`${LINGUISTICS_API_URL}/analyze`, {
        call_id: callId,
        recording_url: recordingUrl,
        transcript: transcript
      });
      
      return {
        analysisId: response.data.analysis_id
      };
    } catch (error) {
      console.error('Error submitting call for linguistics analysis:', error);
      return null;
    }
  },
  
  /**
   * Get analysis status
   */
  async getAnalysisStatus(analysisId: string): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/status`);
      return response.data.status;
    } catch (error) {
      console.error(`Error fetching linguistics analysis status for ${analysisId}:`, error);
      return 'failed';
    }
  },
  
  /**
   * Get key phrases from a call analysis
   */
  async getKeyPhrases(analysisId: string): Promise<LinguisticsAnalysis['key_phrases'] | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/key-phrases`);
      return response.data.key_phrases;
    } catch (error) {
      console.error(`Error fetching key phrases for analysis ${analysisId}:`, error);
      return null;
    }
  },
  
  /**
   * Get sentiment analysis from a call analysis
   */
  async getSentimentAnalysis(analysisId: string): Promise<LinguisticsAnalysis['sentiment_analysis'] | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/sentiment`);
      return response.data.sentiment_analysis;
    } catch (error) {
      console.error(`Error fetching sentiment analysis for analysis ${analysisId}:`, error);
      return null;
    }
  },
  
  /**
   * Get action items from a call analysis
   */
  async getActionItems(analysisId: string): Promise<LinguisticsAnalysis['action_items'] | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/action-items`);
      return response.data.action_items;
    } catch (error) {
      console.error(`Error fetching action items for analysis ${analysisId}:`, error);
      return null;
    }
  },
  
  /**
   * Get questions from a call analysis
   */
  async getQuestions(analysisId: string): Promise<LinguisticsAnalysis['questions_asked'] | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/questions`);
      return response.data.questions;
    } catch (error) {
      console.error(`Error fetching questions for analysis ${analysisId}:`, error);
      return null;
    }
  },
  
  /**
   * Get language metrics from a call analysis
   */
  async getLanguageMetrics(analysisId: string): Promise<LinguisticsAnalysis['language_metrics'] | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/metrics`);
      return response.data.language_metrics;
    } catch (error) {
      console.error(`Error fetching language metrics for analysis ${analysisId}:`, error);
      return null;
    }
  },
  
  /**
   * Get topic segments from a call analysis
   */
  async getTopicSegments(analysisId: string): Promise<LinguisticsAnalysis['topic_segments'] | null> {
    try {
      const response = await axios.get(`${LINGUISTICS_API_URL}/analysis/${analysisId}/topics`);
      return response.data.topic_segments;
    } catch (error) {
      console.error(`Error fetching topic segments for analysis ${analysisId}:`, error);
      return null;
    }
  }
};
