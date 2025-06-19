// AI Transcription Service - OpenAI Whisper & OpenRouter Integration
import { openRouterService } from './openRouterService';

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  duration: number;
  confidence: number;
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface TranscriptionStream {
  onSegment: (segment: TranscriptionSegment) => void;
  onComplete: (result: TranscriptionResult) => void;
  onError: (error: Error) => void;
  stop: () => void;
}

class TranscriptionService {
  private openAIKey: string | null = null;
  private openRouterKey: string | null = null;

  constructor() {
    this.loadApiKeys();
  }

  private async loadApiKeys() {
    // In production, load from secure environment/database
    this.openAIKey = process.env.REACT_APP_OPENAI_API_KEY || null;
    this.openRouterKey = process.env.REACT_APP_OPENROUTER_API_KEY || null;
  }

  // Transcribe audio file using OpenAI Whisper
  async transcribeAudio(audioUrl: string): Promise<TranscriptionResult> {
    try {
      if (!this.openAIKey) {
        console.warn('OpenAI API key not found, falling back to OpenRouter');
        return this.fallbackTranscribe(audioUrl);
      }

      // Fetch audio file
      const audioResponse = await fetch(audioUrl);
      const audioBlob = await audioResponse.blob();
      
      // Create form data for Whisper API
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.mp3');
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      formData.append('timestamp_granularities', 'segment');

      // Call OpenAI Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform Whisper response to our format
      return {
        text: data.text,
        segments: data.segments.map((seg: any) => ({
          id: seg.id,
          start: seg.start,
          end: seg.end,
          text: seg.text,
          confidence: seg.avg_logprob ? Math.exp(seg.avg_logprob) : 0.9
        })),
        language: data.language,
        duration: data.duration,
        confidence: 0.95
      };
    } catch (error) {
      console.error('Whisper transcription error:', error);
      return this.fallbackTranscribe(audioUrl);
    }
  }

  // Real-time transcription for live calls
  startLiveTranscription(callSid: string): TranscriptionStream {
    const segments: TranscriptionSegment[] = [];
    let isActive = true;
    let segmentId = 0;

    // WebSocket connection for real-time audio streaming
    const ws = new WebSocket(`wss://api.openai.com/v1/realtime?model=whisper-1`);
    
    const stream: TranscriptionStream = {
      onSegment: () => {},
      onComplete: () => {},
      onError: () => {},
      stop: () => {
        isActive = false;
        ws.close();
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'session.update',
        session: {
          modalities: ['text'],
          instructions: 'Transcribe the audio stream in real-time',
          voice: 'alloy',
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: {
            model: 'whisper-1'
          }
        }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'conversation.item.created' && data.item.role === 'assistant') {
        const segment: TranscriptionSegment = {
          id: segmentId++,
          start: Date.now() / 1000,
          end: Date.now() / 1000 + 1,
          text: data.item.content[0].text,
          confidence: 0.9
        };
        
        segments.push(segment);
        stream.onSegment(segment);
      }
    };

    ws.onerror = (error) => {
      stream.onError(new Error('WebSocket error'));
    };

    ws.onclose = () => {
      if (isActive) {
        const result: TranscriptionResult = {
          text: segments.map(s => s.text).join(' '),
          segments,
          language: 'en',
          duration: segments.length > 0 ? segments[segments.length - 1].end : 0,
          confidence: 0.9
        };
        stream.onComplete(result);
      }
    };

    return stream;
  }

  // Fallback transcription using OpenRouter
  async fallbackTranscribe(audioUrl: string): Promise<TranscriptionResult> {
    try {
      // For OpenRouter, we'll use a multimodal model that can process audio
      // This is a simplified implementation - in production, you'd need to:
      // 1. Convert audio to a format the model can process
      // 2. Use a model that supports audio input
      
      const prompt = `Please transcribe the following audio file: ${audioUrl}
      
      Return the transcription in the following JSON format:
      {
        "text": "full transcription",
        "segments": [
          {
            "start": 0,
            "end": 5,
            "text": "segment text"
          }
        ]
      }`;

      const response = await openRouterService.query(prompt, {
        model: 'anthropic/claude-3-opus',
        temperature: 0.1,
        max_tokens: 4000
      });

      // Parse the response
      try {
        const parsed = JSON.parse(response);
        return {
          text: parsed.text,
          segments: parsed.segments.map((seg: any, idx: number) => ({
            id: idx,
            start: seg.start,
            end: seg.end,
            text: seg.text,
            confidence: 0.85
          })),
          language: 'en',
          duration: parsed.segments.length > 0 ? parsed.segments[parsed.segments.length - 1].end : 0,
          confidence: 0.85
        };
      } catch (parseError) {
        // If parsing fails, return simple text response
        return {
          text: response,
          segments: [{
            id: 0,
            start: 0,
            end: 10,
            text: response,
            confidence: 0.8
          }],
          language: 'en',
          duration: 10,
          confidence: 0.8
        };
      }
    } catch (error) {
      console.error('Fallback transcription error:', error);
      throw new Error('Transcription failed');
    }
  }

  // Enhanced transcription with speaker diarization
  async transcribeWithSpeakers(audioUrl: string): Promise<TranscriptionResult> {
    const baseTranscription = await this.transcribeAudio(audioUrl);
    
    // Enhance with speaker identification
    // In production, this would use a speaker diarization model
    const enhancedSegments = await this.identifySpeakers(baseTranscription.segments);
    
    return {
      ...baseTranscription,
      segments: enhancedSegments
    };
  }

  // Identify speakers in segments
  private async identifySpeakers(segments: TranscriptionSegment[]): Promise<TranscriptionSegment[]> {
    // Simplified speaker identification
    // In production, use a proper speaker diarization model
    
    let currentSpeaker = 'rep';
    const enhancedSegments: TranscriptionSegment[] = [];
    
    for (const segment of segments) {
      // Simple heuristic: alternate speakers on questions
      if (segment.text.includes('?')) {
        currentSpeaker = currentSpeaker === 'rep' ? 'prospect' : 'rep';
      }
      
      enhancedSegments.push({
        ...segment,
        speaker: currentSpeaker
      });
    }
    
    return enhancedSegments;
  }

  // Process transcription for call analysis
  async processForAnalysis(transcription: TranscriptionResult): Promise<{
    cleanedText: string;
    keyPhrases: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    topics: string[];
  }> {
    // Clean up transcription
    const cleanedText = transcription.text
      .replace(/\s+/g, ' ')
      .trim();
    
    // Extract key phrases using OpenRouter
    const analysisPrompt = `Analyze this sales call transcription and extract:
    1. Key phrases and important moments
    2. Overall sentiment (positive/negative/neutral)
    3. Main topics discussed
    
    Transcription: ${cleanedText}
    
    Return as JSON: { keyPhrases: [], sentiment: "", topics: [] }`;
    
    try {
      const response = await openRouterService.query(analysisPrompt, {
        model: 'anthropic/claude-3-haiku',
        temperature: 0.1,
        max_tokens: 1000
      });
      
      const analysis = JSON.parse(response);
      return {
        cleanedText,
        keyPhrases: analysis.keyPhrases || [],
        sentiment: analysis.sentiment || 'neutral',
        topics: analysis.topics || []
      };
    } catch (error) {
      console.error('Analysis error:', error);
      return {
        cleanedText,
        keyPhrases: [],
        sentiment: 'neutral',
        topics: []
      };
    }
  }
}

export const transcriptionService = new TranscriptionService();