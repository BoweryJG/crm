// Audio processing service for call transcription and analysis
// This service processes audio files without storing them permanently

interface TranscriptionResult {
  transcript: string;
  duration: number; // in seconds
  confidence?: number;
}

interface AudioAnalysisResult {
  transcript: string;
  duration: number;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  keyTopics: string[];
  actionItems: string[];
  speakerSegments?: Array<{
    speaker: string;
    start: number;
    end: number;
    text: string;
  }>;
}

export class AudioProcessor {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey: string, provider: 'openai' | 'google' | 'assemblyai' = 'openai') {
    this.apiKey = apiKey;
    
    // Set endpoint based on provider
    switch (provider) {
      case 'openai':
        this.apiEndpoint = 'https://api.openai.com/v1/audio/transcriptions';
        break;
      case 'google':
        this.apiEndpoint = 'https://speech.googleapis.com/v1/speech:recognize';
        break;
      case 'assemblyai':
        this.apiEndpoint = 'https://api.assemblyai.com/v2/transcript';
        break;
    }
  }

  /**
   * Process audio file and return transcription
   * File is processed in memory and not stored
   */
  async transcribeAudio(audioFile: File): Promise<TranscriptionResult> {
    try {
      // Create form data for API request
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');

      // Send to transcription API
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        transcript: result.text,
        duration: result.duration || 0,
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw error;
    }
  }

  /**
   * Analyze transcription for insights
   */
  async analyzeTranscript(transcript: string, duration: number): Promise<AudioAnalysisResult> {
    try {
      // Use AI to analyze the transcript
      const analysisPrompt = `
        Analyze this business call transcript and provide:
        1. A brief summary (2-3 sentences)
        2. Overall sentiment (positive/neutral/negative) with score (-1 to 1)
        3. Key topics discussed (as an array)
        4. Action items mentioned (as an array)
        
        Transcript:
        ${transcript}
        
        Return as JSON with keys: summary, sentiment, sentimentScore, keyTopics, actionItems
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a business call analyst. Analyze call transcripts for key insights.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      const analysis = JSON.parse(result.choices[0].message.content);

      return {
        transcript,
        duration,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
        keyTopics: analysis.keyTopics,
        actionItems: analysis.actionItems
      };
    } catch (error) {
      console.error('Transcript analysis error:', error);
      throw error;
    }
  }

  /**
   * Process audio file completely - transcribe and analyze
   */
  async processAudioFile(audioFile: File): Promise<AudioAnalysisResult> {
    // Step 1: Transcribe audio
    const transcription = await this.transcribeAudio(audioFile);
    
    // Step 2: Analyze transcript
    const analysis = await this.analyzeTranscript(
      transcription.transcript, 
      transcription.duration
    );

    return analysis;
  }

  /**
   * Extract audio metadata without processing content
   */
  async getAudioMetadata(audioFile: File): Promise<{
    duration: number;
    fileSize: number;
    mimeType: string;
  }> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(audioFile);

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          duration: audio.duration,
          fileSize: audioFile.size,
          mimeType: audioFile.type
        });
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load audio metadata'));
      });

      audio.src = objectUrl;
    });
  }
}

// Helper function to process audio from file input
export async function processCallRecording(
  file: File,
  apiKey: string
): Promise<AudioAnalysisResult> {
  const processor = new AudioProcessor(apiKey);
  return processor.processAudioFile(file);
}

// Helper to convert audio analysis to CRM format
export function audioAnalysisToCRMFormat(
  analysis: AudioAnalysisResult,
  contactId: string,
  practiceId: string
) {
  return {
    callAnalysis: {
      title: 'Call Recording Analysis',
      call_date: new Date().toISOString(),
      duration: Math.round(analysis.duration / 60), // Convert to minutes
      contact_id: contactId,
      practice_id: practiceId,
      transcript: analysis.transcript,
      summary: analysis.summary,
      sentiment_score: analysis.sentimentScore,
      tags: analysis.keyTopics,
      notes: `Action Items:\n${analysis.actionItems.join('\n')}`
    },
    salesActivity: {
      type: 'call' as const,
      contact_id: contactId,
      practice_id: practiceId,
      date: new Date().toISOString(),
      duration: Math.round(analysis.duration / 60),
      notes: analysis.summary,
      outcome: analysis.sentimentScore > 0.3 ? 'successful' : 
              analysis.sentimentScore < -0.3 ? 'unsuccessful' : 
              'follow_up_required',
      next_steps: analysis.actionItems.join('; ')
    }
  };
}