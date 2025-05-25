import { BaseModel } from './models';

/**
 * Call Analysis model representing a recorded and analyzed call
 */
export interface CallAnalysis extends BaseModel {
  title: string;
  call_date: string;
  duration: number; // in seconds
  contact_id?: string;
  practice_id?: string;
  recording_url?: string;
  transcript?: string;
  summary?: string;
  sentiment_score?: number; // -1 to 1, negative to positive
  linguistics_analysis_id?: string; // Reference to linguistics module analysis
  tags?: string[];
  notes?: string;
}

/**
 * Linguistics Analysis model representing the detailed linguistic analysis of a call
 */
export interface LinguisticsAnalysis extends BaseModel {
  call_id: string;
  contact_name?: string;
  language_metrics: LanguageMetrics;
  key_phrases: KeyPhrase[];
  topic_segments: TopicSegment[];
  sentiment_analysis: SentimentAnalysis;
  action_items: ActionItem[];
  questions_asked: Question[];
}

/**
 * Language metrics for a call
 */
export interface LanguageMetrics {
  speaking_pace: number; // words per minute
  talk_to_listen_ratio: number; // ratio of rep talking vs customer talking
  filler_word_frequency: number; // frequency of um, uh, like, etc.
  technical_language_level: number; // 1-10 scale of technical complexity
  interruption_count: number;
  average_response_time: number; // in seconds
}

/**
 * Key phrase identified in a call
 */
export interface KeyPhrase {
  text: string;
  relevance_score: number; // 0-1
  timestamp: number; // seconds from start of call
  speaker: 'rep' | 'customer';
  category?: 'objection' | 'interest' | 'concern' | 'question' | 'other';
}

/**
 * Topic segment of a call
 */
export interface TopicSegment {
  topic: string;
  start_time: number; // seconds from start of call
  end_time: number; // seconds from start of call
  keywords: string[];
  summary: string;
}

/**
 * Sentiment analysis of a call
 */
export interface SentimentAnalysis {
  overall_score: number; // -1 to 1, negative to positive
  progression: Array<{
    timestamp: number; // seconds from start of call
    score: number; // -1 to 1
  }>;
  emotional_triggers: Array<{
    emotion: string;
    timestamp: number;
    text: string;
  }>;
}

/**
 * Action item identified in a call
 */
export interface ActionItem {
  description: string;
  timestamp: number; // seconds from start of call
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

/**
 * Question identified in a call
 */
export interface Question {
  text: string;
  timestamp: number; // seconds from start of call
  speaker: 'rep' | 'customer';
  was_answered: boolean;
  answer?: string;
  answer_timestamp?: number;
}

/**
 * Filter options for call analysis
 */
export interface CallAnalysisFilterOptions {
  startDate?: string;
  endDate?: string;
  contactId?: string;
  practiceId?: string;
  minDuration?: number;
  maxDuration?: number;
  minSentiment?: number;
  maxSentiment?: number;
  tags?: string[];
  hasTranscript?: boolean;
}
