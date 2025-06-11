import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../supabase/supabase';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

// Backend API configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';

export interface GeminiAnalysisResult {
  transcription: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyPoints: string[];
  actionItems: string[];
  topics: string[];
  speakerSegments?: Array<{
    speaker: string;
    text: string;
    timestamp?: string;
  }>;
  callMetrics: {
    talkToListenRatio?: number;
    questionCount?: number;
    objectionCount?: number;
    nextStepsIdentified?: boolean;
  };
}

export interface ProcessRecordingParams {
  audioFile: File;
  contactId?: string;
  contactName?: string;
  practiceId?: string;
  userId: string;
  source: 'plaud' | 'manual' | 'other';
  externalId?: string;
  transcriptionProvider?: 'openai' | 'gemini';
  analysisProvider?: 'openai' | 'gemini';
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  /**
   * Process an audio file through backend API for transcription and analysis
   */
  async processRecording(params: ProcessRecordingParams): Promise<{
    success: boolean;
    data?: GeminiAnalysisResult;
    recordingId?: string;
    error?: string;
  }> {
    try {
      const { 
        audioFile, 
        contactId, 
        contactName, 
        practiceId, 
        userId, 
        source, 
        externalId,
        transcriptionProvider = 'gemini',
        analysisProvider = 'gemini'
      } = params;

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('contactId', contactId || '');
      formData.append('contactName', contactName || '');
      formData.append('practiceId', practiceId || '');
      formData.append('userId', userId);
      formData.append('source', source);
      formData.append('externalId', externalId || '');
      formData.append('transcriptionProvider', transcriptionProvider);
      formData.append('analysisProvider', analysisProvider);

      // Send to backend API
      const response = await fetch(`${BACKEND_URL}/api/upload-external-recording`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `Failed to upload recording: ${response.statusText}`);
      }

      const result = await response.json();

      // The backend returns a more comprehensive response structure
      if (result.success) {
        return {
          success: true,
          data: result.data.analysis || result.data,
          recordingId: result.data.recordingId || result.recordingId,
          error: undefined
        };
      } else {
        return {
          success: false,
          error: result.error || 'Processing failed'
        };
      }

    } catch (error) {
      console.error('Error processing recording:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Convert a file to base64 data URL
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Get analysis for a specific recording
   */
  async getRecordingAnalysis(recordingId: string) {
    try {
      const { data, error } = await supabase
        .from('call_recordings')
        .select('*')
        .eq('id', recordingId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching recording analysis:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all external recordings for a contact
   */
  async getExternalRecordingsForContact(contactId: string) {
    try {
      const { data, error } = await supabase
        .from('call_recordings')
        .select('*')
        .eq('contact_id', contactId)
        .in('source', ['plaud', 'manual', 'other'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching external recordings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const geminiService = new GeminiService();