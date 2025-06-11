import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../supabase/supabase';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

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
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  /**
   * Process an audio file through Gemini for transcription and analysis
   */
  async processRecording(params: ProcessRecordingParams): Promise<{
    success: boolean;
    data?: GeminiAnalysisResult;
    recordingId?: string;
    error?: string;
  }> {
    try {
      const { audioFile, contactId, contactName, practiceId, userId, source, externalId } = params;

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('contactId', contactId || '');
      formData.append('contactName', contactName || '');
      formData.append('practiceId', practiceId || '');
      formData.append('userId', userId);
      formData.append('source', source);
      formData.append('externalId', externalId || '');

      // Send to Netlify function
      const response = await fetch('/.netlify/functions/upload-external-recording', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload recording');
      }

      const result = await response.json();

      return {
        success: result.success,
        data: result.data,
        recordingId: result.recordingId,
        error: result.error
      };

    } catch (error) {
      console.error('Error processing recording with Gemini:', error);
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