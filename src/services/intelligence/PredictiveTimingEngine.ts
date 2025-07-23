// Predictive Timing Engine - Optimal Send Time Algorithms
// Uses machine learning and behavioral patterns to predict best engagement times

import { supabase } from '../supabase/supabase';
import { EventEmitter } from 'events';

export interface TimingPrediction {
  contact_id: string;
  optimal_time: Date;
  confidence_score: number;
  reasoning: TimingReasoning[];
  alternative_windows: TimeWindow[];
  channel_preferences: ChannelPreference[];
}

export interface TimingReasoning {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface TimeWindow {
  start: Date;
  end: Date;
  score: number;
  day_of_week: string;
  time_zone: string;
}

export interface ChannelPreference {
  channel: 'email' | 'sms' | 'call' | 'in_person';
  best_times: TimeWindow[];
  engagement_rate: number;
  response_time_avg: number; // in minutes
}

export interface PracticePattern {
  practice_id: string;
  practice_type: string;
  typical_schedule: SchedulePattern;
  busy_periods: BusyPeriod[];
  communication_preferences: CommunicationPreference[];
  seasonal_variations: SeasonalPattern[];
}

export interface SchedulePattern {
  office_hours: DaySchedule[];
  lunch_break: { start: string; end: string };
  meeting_times: string[]; // Common meeting times
  patient_hours: { start: string; end: string };
  admin_time: string[]; // Times for administrative work
}

export interface DaySchedule {
  day: string;
  open: string;
  close: string;
  is_open: boolean;
}

export interface BusyPeriod {
  period_name: string;
  days: string[];
  times: { start: string; end: string };
  reason: string;
  avoid_contact: boolean;
}

export interface CommunicationPreference {
  preference_type: string;
  value: unknown;
  source: 'stated' | 'observed' | 'inferred';
  confidence: number;
}

export interface SeasonalPattern {
  season: string;
  months: number[];
  impact: string;
  adjustment_factor: number;
}

export interface EngagementHistory {
  contact_id: string;
  interaction_type: string;
  timestamp: Date;
  day_of_week: number;
  hour_of_day: number;
  response_time?: number;
  engagement_score: number;
  outcome: 'positive' | 'neutral' | 'negative';
}

export interface TimingModel {
  model_id: string;
  model_type: 'individual' | 'practice' | 'specialty' | 'global';
  features: ModelFeature[];
  accuracy_score: number;
  last_trained: Date;
  training_samples: number;
}

export interface ModelFeature {
  feature_name: string;
  importance: number;
  type: 'categorical' | 'numerical' | 'temporal';
}

interface IndividualPattern {
  hasPattern: boolean;
  consistency: number;
  peakTimes?: PeakTime[];
  totalEngagements?: number;
}

interface PeakTime {
  day: number;
  hour: number;
  score: number;
  count: number;
}

interface PracticeScheduleAnalysis {
  hasSchedule: boolean;
  availableWindows?: TimeWindowWithReason[];
  preferredTimes?: string[];
  avoidTimes?: BusyPeriod[];
}

interface TimeWindowWithReason extends TimeWindow {
  reason: string;
}

interface SpecialtyNorm {
  bestDays: string[];
  bestTimes: { start: string; end: string; score: number }[];
  avoidTimes: { start: string; end: string; score: number }[];
  responseWindow: number;
  specialty?: string;
}

interface DayEngagementStat {
  day: string;
  engagement_rate: number;
  total_engagements: number;
}

interface TimeEngagementStat {
  hour: string;
  engagement_rate: number;
  total_engagements: number;
}

interface ChannelPerformanceDetail {
  engagement_rate: number;
  avg_response_time: number | null;
  total_interactions: number;
}

export class PredictiveTimingEngine extends EventEmitter {
  private static instance: PredictiveTimingEngine;
  private practicePatterns: Map<string, PracticePattern> = new Map();
  private engagementCache: Map<string, EngagementHistory[]> = new Map();
  private timingModels: Map<string, TimingModel> = new Map();
  
  // Default timing patterns by practice type
  private readonly DEFAULT_PATTERNS = {
    dental: {
      best_days: ['Tuesday', 'Wednesday', 'Thursday'],
      best_times: ['10:00-11:30', '14:00-15:30'],
      avoid_times: ['08:00-09:00', '12:00-13:00', '16:30-18:00'],
      response_window: 48 // hours
    },
    medical: {
      best_days: ['Tuesday', 'Wednesday', 'Thursday'],
      best_times: ['11:00-12:00', '15:00-16:00'],
      avoid_times: ['07:00-09:00', '12:00-13:30', '17:00-19:00'],
      response_window: 72 // hours
    },
    aesthetic: {
      best_days: ['Monday', 'Tuesday', 'Thursday'],
      best_times: ['10:30-11:30', '14:30-16:00'],
      avoid_times: ['09:00-10:00', '12:00-13:00', '17:00-18:00'],
      response_window: 96 // hours
    }
  };

  // Engagement scoring weights
  private readonly ENGAGEMENT_WEIGHTS = {
    opened: 1.0,
    clicked: 2.0,
    replied: 3.0,
    meeting_scheduled: 5.0,
    purchase: 10.0,
    unsubscribed: -10.0,
    marked_spam: -20.0
  };

  private constructor() {
    super();
    this.initialize();
  }

  static getInstance(): PredictiveTimingEngine {
    if (!PredictiveTimingEngine.instance) {
      PredictiveTimingEngine.instance = new PredictiveTimingEngine();
    }
    return PredictiveTimingEngine.instance;
  }

  private async initialize() {
    await this.loadPracticePatterns();
    await this.loadTimingModels();
    this.startPatternLearning();
  }

  private async loadPracticePatterns() {
    const { data, error } = await supabase
      .from('practice_patterns')
      .select('*');

    if (error) {
      console.error('Error loading practice patterns:', error);
      return;
    }

    data?.forEach(pattern => {
      this.practicePatterns.set(pattern.practice_id, pattern);
    });
  }

  private async loadTimingModels() {
    const { data, error } = await supabase
      .from('timing_models')
      .select('*');

    if (error) {
      console.error('Error loading timing models:', error);
      return;
    }

    data?.forEach(model => {
      this.timingModels.set(model.model_id, model);
    });
  }

  private startPatternLearning() {
    // Set up real-time learning from engagement data
    const subscription = supabase
      .channel('engagement-learning')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'engagement_history'
      }, (payload) => {
        this.updatePatterns(payload.new as EngagementHistory);
      })
      .subscribe();
  }

  // Main prediction method
  async predictOptimalTiming(
    contactId: string,
    messageType: 'email' | 'sms' | 'call',
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<TimingPrediction> {
    // Get contact and practice information
    const contact = await this.getContactInfo(contactId);
    const practicePattern = this.practicePatterns.get(contact.practice_id);
    
    // Get engagement history
    const engagementHistory = await this.getEngagementHistory(contactId);
    
    // Calculate optimal timing using multiple factors
    const individualPattern = this.analyzeIndividualPattern(engagementHistory);
    const practiceSchedule = this.analyzePracticeSchedule(practicePattern);
    const specialtyNorms = this.getSpecialtyNorms(contact.specialty);
    const channelPreferences = this.analyzeChannelPreferences(engagementHistory, messageType);
    
    // Combine all factors with weights
    const optimalTime = this.calculateOptimalTime(
      individualPattern,
      practiceSchedule,
      specialtyNorms,
      urgency
    );
    
    // Generate reasoning
    const reasoning = this.generateTimingReasoning(
      individualPattern,
      practiceSchedule,
      specialtyNorms,
      channelPreferences
    );
    
    // Find alternative windows
    const alternativeWindows = this.findAlternativeWindows(
      optimalTime,
      practiceSchedule,
      urgency
    );
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidence(
      engagementHistory.length,
      individualPattern.consistency,
      practicePattern ? 1 : 0.5
    );

    return {
      contact_id: contactId,
      optimal_time: optimalTime,
      confidence_score: confidenceScore,
      reasoning,
      alternative_windows: alternativeWindows,
      channel_preferences: channelPreferences
    };
  }

  // Analyze individual engagement patterns
  private analyzeIndividualPattern(history: EngagementHistory[]): IndividualPattern {
    if (history.length === 0) {
      return { hasPattern: false, consistency: 0 };
    }

    // Group by day of week and hour
    const dayHourMap = new Map<string, number[]>();
    
    history.forEach(event => {
      const key = `${event.day_of_week}-${event.hour_of_day}`;
      if (!dayHourMap.has(key)) {
        dayHourMap.set(key, []);
      }
      dayHourMap.get(key)!.push(event.engagement_score);
    });

    // Find peak engagement times
    const peakTimes: PeakTime[] = [];
    dayHourMap.forEach((scores, key) => {
      const [day, hour] = key.split('-').map(Number);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      peakTimes.push({ day, hour, score: avgScore, count: scores.length });
    });

    // Sort by score
    peakTimes.sort((a, b) => b.score - a.score);

    // Calculate consistency
    const consistency = this.calculatePatternConsistency(peakTimes);

    return {
      hasPattern: true,
      peakTimes: peakTimes.slice(0, 5),
      consistency,
      totalEngagements: history.length
    };
  }

  private calculatePatternConsistency(peakTimes: PeakTime[]): number {
    if (peakTimes.length < 2) return 0;

    // Calculate variance in top engagement times
    const topScores = peakTimes.slice(0, 5).map(t => t.score);
    const mean = topScores.reduce((a, b) => a + b, 0) / topScores.length;
    const variance = topScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / topScores.length;
    
    // Lower variance = higher consistency
    return Math.max(0, 1 - (variance / mean));
  }

  // Analyze practice schedule
  private analyzePracticeSchedule(pattern: PracticePattern | undefined): PracticeScheduleAnalysis {
    if (!pattern) {
      return { hasSchedule: false };
    }

    const schedule = pattern.typical_schedule;
    const availableWindows: TimeWindowWithReason[] = [];

    schedule.office_hours.forEach(daySchedule => {
      if (!daySchedule.is_open) return;

      // Find windows outside of patient hours and busy periods
      const windows = this.findAvailableWindows(
        daySchedule,
        schedule.patient_hours,
        pattern.busy_periods,
        schedule.lunch_break
      );

      windows.forEach(window => {
        availableWindows.push({
          ...window,
          day_of_week: daySchedule.day
        });
      });
    });

    return {
      hasSchedule: true,
      availableWindows,
      preferredTimes: schedule.admin_time,
      avoidTimes: pattern.busy_periods
    };
  }

  private findAvailableWindows(
    daySchedule: DaySchedule,
    patientHours: { start: string; end: string },
    busyPeriods: BusyPeriod[],
    lunchBreak: { start: string; end: string }
  ): TimeWindowWithReason[] {
    const windows: TimeWindowWithReason[] = [];
    
    // Morning window (before patient hours)
    if (this.timeToMinutes(daySchedule.open) < this.timeToMinutes(patientHours.start)) {
      windows.push({
        start: this.timeStringToDate(daySchedule.open),
        end: this.timeStringToDate(patientHours.start),
        score: 0.8,
        reason: 'Before patient hours',
        day_of_week: daySchedule.day,
        time_zone: 'America/New_York'
      });
    }

    // Lunch window (if not too restricted)
    const lunchDuration = this.timeToMinutes(lunchBreak.end) - this.timeToMinutes(lunchBreak.start);
    if (lunchDuration > 45) {
      windows.push({
        start: this.timeStringToDate(this.addMinutes(lunchBreak.start, 15)),
        end: this.timeStringToDate(this.addMinutes(lunchBreak.end, -15)),
        score: 0.6,
        reason: 'During extended lunch',
        day_of_week: daySchedule.day,
        time_zone: 'America/New_York'
      });
    }

    // End of day window
    if (this.timeToMinutes(patientHours.end) < this.timeToMinutes(daySchedule.close)) {
      windows.push({
        start: this.timeStringToDate(patientHours.end),
        end: this.timeStringToDate(daySchedule.close),
        score: 0.9,
        reason: 'After patient hours',
        day_of_week: daySchedule.day,
        time_zone: 'America/New_York'
      });
    }

    // Filter out busy periods
    return windows.filter(window => {
      return !busyPeriods.some(busy => {
        // Convert Date objects back to time strings for comparison
        const windowTimeStrings = {
          start: this.dateToTimeString(window.start),
          end: this.dateToTimeString(window.end)
        };
        return busy.avoid_contact && this.windowsOverlap(windowTimeStrings, busy.times);
      });
    });
  }

  // Get specialty-specific norms
  private getSpecialtyNorms(specialty: string): SpecialtyNorm {
    const norms = this.DEFAULT_PATTERNS[specialty as keyof typeof this.DEFAULT_PATTERNS] 
      || this.DEFAULT_PATTERNS.medical;

    return {
      bestDays: norms.best_days,
      bestTimes: norms.best_times.map(time => {
        const [start, end] = time.split('-');
        return { start, end, score: 1.0 };
      }),
      avoidTimes: norms.avoid_times.map(time => {
        const [start, end] = time.split('-');
        return { start, end, score: 0.0 };
      }),
      responseWindow: norms.response_window
    };
  }

  // Analyze channel preferences
  private analyzeChannelPreferences(
    history: EngagementHistory[],
    requestedChannel: string
  ): ChannelPreference[] {
    const channelStats = new Map<string, any>();

    // Initialize channels
    ['email', 'sms', 'call', 'in_person'].forEach(channel => {
      channelStats.set(channel, {
        engagements: 0,
        totalScore: 0,
        responseTimes: [],
        bestTimes: []
      });
    });

    // Analyze history by channel
    history.forEach(event => {
      const stats = channelStats.get(event.interaction_type);
      if (stats) {
        stats.engagements++;
        stats.totalScore += event.engagement_score;
        if (event.response_time) {
          stats.responseTimes.push(event.response_time);
        }
        if (event.engagement_score > 0) {
          stats.bestTimes.push({
            day: event.day_of_week,
            hour: event.hour_of_day,
            score: event.engagement_score
          });
        }
      }
    });

    // Calculate preferences
    const preferences: ChannelPreference[] = [];
    
    channelStats.forEach((stats, channel) => {
      if (stats.engagements > 0) {
        preferences.push({
          channel: channel as any,
          best_times: this.consolidateBestTimes(stats.bestTimes),
          engagement_rate: stats.totalScore / stats.engagements,
          response_time_avg: stats.responseTimes.length > 0
            ? stats.responseTimes.reduce((a: number, b: number) => a + b, 0) / stats.responseTimes.length
            : 0
        });
      }
    });

    // Sort by engagement rate
    preferences.sort((a, b) => b.engagement_rate - a.engagement_rate);

    return preferences;
  }

  private consolidateBestTimes(times: { day: number; hour: number; score: number }[]): TimeWindow[] {
    // Group similar times and average scores
    const consolidated: TimeWindow[] = [];
    
    // Group by day and nearby hours
    const grouped = new Map<string, any[]>();
    
    times.forEach(time => {
      const key = `${time.day}-${Math.floor(time.hour / 2) * 2}`; // Group by 2-hour blocks
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(time);
    });

    grouped.forEach((group, key) => {
      const [day, hourBlock] = key.split('-').map(Number);
      const avgScore = group.reduce((sum, t) => sum + t.score, 0) / group.length;
      
      consolidated.push({
        start: new Date(`2024-01-01 ${hourBlock}:00`),
        end: new Date(`2024-01-01 ${hourBlock + 2}:00`),
        score: avgScore,
        day_of_week: this.dayNumberToName(day),
        time_zone: 'America/New_York' // Would get from contact
      });
    });

    return consolidated.slice(0, 3); // Top 3 windows
  }

  // Calculate optimal time combining all factors
  private calculateOptimalTime(
    individualPattern: IndividualPattern,
    practiceSchedule: PracticeScheduleAnalysis,
    specialtyNorms: SpecialtyNorm,
    urgency: string
  ): Date {
    const now = new Date();
    const candidates: { time: Date; score: number }[] = [];

    // Generate candidate times for next 7 days
    for (let days = 0; days < 7; days++) {
      const date = new Date(now);
      date.setDate(date.getDate() + days);
      
      // Skip weekends unless urgent
      if (urgency !== 'high' && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }

      // Check each hour
      for (let hour = 8; hour < 18; hour++) {
        const candidateTime = new Date(date);
        candidateTime.setHours(hour, 0, 0, 0);

        // Calculate score for this time
        const score = this.scoreCandidate(
          candidateTime,
          individualPattern,
          practiceSchedule,
          specialtyNorms
        );

        if (score > 0) {
          candidates.push({ time: candidateTime, score });
        }
      }
    }

    // Apply urgency adjustments
    if (urgency === 'high') {
      // For high urgency, boost scores for sooner times
      candidates.forEach(candidate => {
        const hoursFromNow = (candidate.time.getTime() - now.getTime()) / (1000 * 60 * 60);
        candidate.score *= (1 + (24 - hoursFromNow) / 24);
      });
    }

    // Sort by score and return best time
    candidates.sort((a, b) => b.score - a.score);
    
    return candidates.length > 0 ? candidates[0].time : this.getDefaultTime(urgency);
  }

  private scoreCandidate(
    time: Date,
    individualPattern: IndividualPattern,
    practiceSchedule: PracticeScheduleAnalysis,
    specialtyNorms: SpecialtyNorm
  ): number {
    let score = 0.5; // Base score

    // Individual pattern scoring
    if (individualPattern.hasPattern) {
      const dayHour = `${time.getDay()}-${time.getHours()}`;
      const match = individualPattern.peakTimes?.find((p) => 
        `${p.day}-${p.hour}` === dayHour
      );
      if (match) {
        score += 0.3 * (match.score / 5); // Normalize to 0-1
      }
    }

    // Practice schedule scoring
    if (practiceSchedule.hasSchedule) {
      const timeStr = `${time.getHours()}:00`;
      const dayName = this.dayNumberToName(time.getDay());
      
      const inAvailableWindow = practiceSchedule.availableWindows?.some((w) =>
        w.day_of_week === dayName && 
        this.isTimeInWindow(timeStr, {
          start: this.dateToTimeString(w.start),
          end: this.dateToTimeString(w.end)
        })
      );
      
      if (inAvailableWindow) {
        score += 0.2;
      }
      
      // Avoid busy periods
      const inBusyPeriod = practiceSchedule.avoidTimes?.some((busy) =>
        busy.days.includes(dayName) &&
        this.isTimeInWindow(timeStr, busy.times)
      );
      
      if (inBusyPeriod) {
        score -= 0.5;
      }
    }

    // Specialty norms scoring
    const dayName = this.dayNumberToName(time.getDay());
    if (specialtyNorms.bestDays.includes(dayName)) {
      score += 0.1;
    }

    const timeStr = `${time.getHours()}:00`;
    const inBestTime = specialtyNorms.bestTimes.some((t) =>
      this.isTimeInWindow(timeStr, t)
    );
    if (inBestTime) {
      score += 0.2;
    }

    const inAvoidTime = specialtyNorms.avoidTimes.some((t) =>
      this.isTimeInWindow(timeStr, t)
    );
    if (inAvoidTime) {
      score -= 0.3;
    }

    return Math.max(0, Math.min(1, score));
  }

  // Generate timing reasoning
  private generateTimingReasoning(
    individualPattern: IndividualPattern,
    practiceSchedule: PracticeScheduleAnalysis,
    specialtyNorms: SpecialtyNorm,
    channelPreferences: ChannelPreference[]
  ): TimingReasoning[] {
    const reasoning: TimingReasoning[] = [];

    // Individual pattern reasoning
    if (individualPattern.hasPattern && individualPattern.consistency > 0.7) {
      reasoning.push({
        factor: 'Historical Engagement',
        impact: 'positive',
        weight: 0.3,
        description: `Contact typically engages during identified peak times with ${(individualPattern.consistency * 100).toFixed(0)}% consistency`
      });
    }

    // Practice schedule reasoning
    if (practiceSchedule.hasSchedule) {
      reasoning.push({
        factor: 'Practice Schedule',
        impact: 'positive',
        weight: 0.25,
        description: 'Timing aligns with practice administrative hours and avoids patient care times'
      });
    }

    // Specialty norms reasoning
    reasoning.push({
      factor: 'Industry Best Practices',
      impact: 'positive',
      weight: 0.2,
      description: `Based on successful engagement patterns for ${specialtyNorms.specialty || 'healthcare'} professionals`
    });

    // Channel preference reasoning
    const topChannel = channelPreferences[0];
    if (topChannel && topChannel.engagement_rate > 0.5) {
      reasoning.push({
        factor: 'Channel Preference',
        impact: 'positive',
        weight: 0.15,
        description: `${topChannel.channel} shows highest engagement rate at ${(topChannel.engagement_rate * 100).toFixed(0)}%`
      });
    }

    return reasoning.sort((a, b) => b.weight - a.weight);
  }

  // Find alternative time windows
  private findAlternativeWindows(
    optimalTime: Date,
    practiceSchedule: PracticeScheduleAnalysis,
    urgency: string
  ): TimeWindow[] {
    const alternatives: TimeWindow[] = [];
    const baseScore = 0.8;

    // Generate alternatives around optimal time
    for (let offset = -2; offset <= 2; offset++) {
      if (offset === 0) continue; // Skip optimal time

      const altTime = new Date(optimalTime);
      altTime.setHours(altTime.getHours() + offset);

      // Check if valid business hours
      if (altTime.getHours() >= 8 && altTime.getHours() <= 17) {
        alternatives.push({
          start: new Date(altTime),
          end: new Date(altTime.getTime() + 60 * 60 * 1000), // 1 hour window
          score: baseScore - Math.abs(offset) * 0.1,
          day_of_week: this.dayNumberToName(altTime.getDay()),
          time_zone: 'America/New_York'
        });
      }
    }

    // Add next day same time if not urgent
    if (urgency !== 'high') {
      const nextDay = new Date(optimalTime);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Skip if weekend
      if (nextDay.getDay() !== 0 && nextDay.getDay() !== 6) {
        alternatives.push({
          start: nextDay,
          end: new Date(nextDay.getTime() + 60 * 60 * 1000),
          score: baseScore - 0.2,
          day_of_week: this.dayNumberToName(nextDay.getDay()),
          time_zone: 'America/New_York'
        });
      }
    }

    return alternatives.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // Calculate confidence score
  private calculateConfidence(
    historySize: number,
    patternConsistency: number,
    hasScheduleData: number
  ): number {
    // Base confidence on data availability
    let confidence = 0.3; // Base confidence

    // History size factor (max 0.3)
    confidence += Math.min(historySize / 50, 0.3);

    // Pattern consistency factor (max 0.2)
    confidence += patternConsistency * 0.2;

    // Schedule data factor (max 0.2)
    confidence += hasScheduleData * 0.2;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  // Update patterns based on new engagement data
  private async updatePatterns(engagement: EngagementHistory) {
    // Update individual cache
    const cached = this.engagementCache.get(engagement.contact_id) || [];
    cached.push(engagement);
    this.engagementCache.set(engagement.contact_id, cached);

    // Update practice patterns if significant
    if (engagement.engagement_score > 2) {
      await this.updatePracticePattern(engagement);
    }

    // Emit event for model retraining if needed
    if (cached.length % 10 === 0) {
      this.emit('retrain-needed', engagement.contact_id);
    }
  }

  private async updatePracticePattern(engagement: EngagementHistory) {
    // Get contact's practice
    const { data: contact } = await supabase
      .from('contacts')
      .select('practice_id')
      .eq('id', engagement.contact_id)
      .single();

    if (!contact) return;

    // Update practice pattern statistics
    // This would be more sophisticated in production
    const pattern = this.practicePatterns.get(contact.practice_id);
    if (pattern) {
      // Update communication preferences based on successful engagements
      const existingPref = pattern.communication_preferences.find(p => 
        p.preference_type === 'best_time'
      );

      if (existingPref) {
        // Update confidence based on new data
        existingPref.confidence = Math.min(existingPref.confidence + 0.01, 1.0);
      }
    }
  }

  // Helper methods
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private addMinutes(time: string, minutes: number): string {
    const totalMinutes = this.timeToMinutes(time) + minutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private timeStringToDate(timeStr: string): Date {
    // Create a date object for today with the given time
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
    return date;
  }

  private dateToTimeString(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  private windowsOverlap(window1: { start: string; end: string }, window2: { start: string; end: string }): boolean {
    const start1 = this.timeToMinutes(window1.start);
    const end1 = this.timeToMinutes(window1.end);
    const start2 = this.timeToMinutes(window2.start);
    const end2 = this.timeToMinutes(window2.end);

    return start1 < end2 && start2 < end1;
  }

  private isTimeInWindow(time: string, window: { start: string; end: string }): boolean {
    const timeMinutes = this.timeToMinutes(time);
    const startMinutes = this.timeToMinutes(window.start);
    const endMinutes = this.timeToMinutes(window.end);

    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }

  private dayNumberToName(dayNum: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  }

  private getDefaultTime(urgency: string): Date {
    const now = new Date();
    const defaultTime = new Date(now);

    switch (urgency) {
      case 'high':
        // Next business hour
        defaultTime.setHours(defaultTime.getHours() + 1, 0, 0, 0);
        break;
      case 'medium':
        // Tomorrow 10 AM
        defaultTime.setDate(defaultTime.getDate() + 1);
        defaultTime.setHours(10, 0, 0, 0);
        break;
      case 'low':
        // In 3 days at 2 PM
        defaultTime.setDate(defaultTime.getDate() + 3);
        defaultTime.setHours(14, 0, 0, 0);
        break;
    }

    // Adjust for weekends
    if (defaultTime.getDay() === 0) defaultTime.setDate(defaultTime.getDate() + 1);
    if (defaultTime.getDay() === 6) defaultTime.setDate(defaultTime.getDate() + 2);

    return defaultTime;
  }

  private async getContactInfo(contactId: string): Promise<any> {
    const { data } = await supabase
      .from('contacts')
      .select('*, practice:practices(*)')
      .eq('id', contactId)
      .single();

    return data || { practice_id: '', specialty: 'medical' };
  }

  private async getEngagementHistory(contactId: string): Promise<EngagementHistory[]> {
    // Check cache first
    const cached = this.engagementCache.get(contactId);
    if (cached && cached.length > 0) {
      return cached;
    }

    // Load from database
    const { data, error } = await supabase
      .from('engagement_history')
      .select('*')
      .eq('contact_id', contactId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error loading engagement history:', error);
      return [];
    }

    const history = data || [];
    this.engagementCache.set(contactId, history);
    return history;
  }

  // Public methods for external use
  async getOptimalSendWindow(
    contactIds: string[],
    messageType: 'email' | 'sms' | 'call',
    campaign?: { urgency: string; content_type: string }
  ): Promise<Map<string, TimingPrediction>> {
    const predictions = new Map<string, TimingPrediction>();

    // Process in batches for efficiency
    const batchSize = 10;
    for (let i = 0; i < contactIds.length; i += batchSize) {
      const batch = contactIds.slice(i, i + batchSize);
      const batchPredictions = await Promise.all(
        batch.map(id => this.predictOptimalTiming(
          id, 
          messageType, 
          campaign?.urgency as any || 'medium'
        ))
      );

      batchPredictions.forEach((prediction, index) => {
        predictions.set(batch[index], prediction);
      });
    }

    return predictions;
  }

  // Get timing insights for a practice
  async getPracticeTimingInsights(practiceId: string): Promise<{
    status?: string;
    bestDays?: DayEngagementStat[];
    bestTimes?: TimeEngagementStat[];
    channelPerformance?: Record<string, ChannelPerformanceDetail>;
    recommendations?: string[];
  }> {
    const pattern = this.practicePatterns.get(practiceId);
    if (!pattern) {
      return { status: 'No pattern data available' };
    }

    // Get aggregate engagement data for the practice
    const { data: engagements } = await supabase
      .from('engagement_history')
      .select('*')
      .eq('practice_id', practiceId)
      .order('timestamp', { ascending: false })
      .limit(500);

    // Analyze patterns
    const insights = {
      bestDays: this.analyzeBestDays(engagements || []),
      bestTimes: this.analyzeBestTimes(engagements || []),
      channelPerformance: this.analyzeChannelPerformance(engagements || []),
      recommendations: this.generatePracticeRecommendations(pattern, engagements || [])
    };

    return insights;
  }

  private analyzeBestDays(engagements: EngagementHistory[]): DayEngagementStat[] {
    const dayStats = new Map<number, { total: number; positive: number }>();

    engagements.forEach(e => {
      const stats = dayStats.get(e.day_of_week) || { total: 0, positive: 0 };
      stats.total++;
      if (e.outcome === 'positive') stats.positive++;
      dayStats.set(e.day_of_week, stats);
    });

    const results: DayEngagementStat[] = [];
    dayStats.forEach((stats, day) => {
      results.push({
        day: this.dayNumberToName(day),
        engagement_rate: stats.positive / stats.total,
        total_engagements: stats.total
      });
    });

    return results.sort((a, b) => b.engagement_rate - a.engagement_rate);
  }

  private analyzeBestTimes(engagements: EngagementHistory[]): TimeEngagementStat[] {
    const hourStats = new Map<number, { total: number; positive: number }>();

    engagements.forEach(e => {
      const stats = hourStats.get(e.hour_of_day) || { total: 0, positive: 0 };
      stats.total++;
      if (e.outcome === 'positive') stats.positive++;
      hourStats.set(e.hour_of_day, stats);
    });

    const results: TimeEngagementStat[] = [];
    hourStats.forEach((stats, hour) => {
      results.push({
        hour: `${hour}:00`,
        engagement_rate: stats.positive / stats.total,
        total_engagements: stats.total
      });
    });

    return results.sort((a, b) => b.engagement_rate - a.engagement_rate).slice(0, 5);
  }

  private analyzeChannelPerformance(engagements: EngagementHistory[]): Record<string, ChannelPerformanceDetail> {
    const channelStats = new Map<string, any>();

    engagements.forEach(e => {
      const stats = channelStats.get(e.interaction_type) || {
        total: 0,
        positive: 0,
        response_times: []
      };
      stats.total++;
      if (e.outcome === 'positive') stats.positive++;
      if (e.response_time) stats.response_times.push(e.response_time);
      channelStats.set(e.interaction_type, stats);
    });

    const results: Record<string, ChannelPerformanceDetail> = {};
    channelStats.forEach((stats, channel) => {
      results[channel] = {
        engagement_rate: stats.positive / stats.total,
        avg_response_time: stats.response_times.length > 0
          ? stats.response_times.reduce((a: number, b: number) => a + b, 0) / stats.response_times.length
          : null,
        total_interactions: stats.total
      };
    });

    return results;
  }

  private generatePracticeRecommendations(
    pattern: PracticePattern,
    engagements: EngagementHistory[]
  ): string[] {
    const recommendations: string[] = [];

    // Analyze current performance
    const recentEngagements = engagements.filter(e => {
      const daysAgo = (Date.now() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30;
    });

    const recentSuccessRate = recentEngagements.filter(e => e.outcome === 'positive').length / recentEngagements.length;

    if (recentSuccessRate < 0.3) {
      recommendations.push('Consider adjusting communication timing - current success rate is below average');
    }

    // Check if following best practices
    const bestTimes = this.analyzeBestTimes(engagements);
    if (bestTimes.length > 0) {
      recommendations.push(`Focus communications during peak engagement hours: ${bestTimes.slice(0, 3).map(t => t.hour).join(', ')}`);
    }

    // Channel recommendations
    const channelPerf = this.analyzeChannelPerformance(engagements);
    const bestChannel = Object.entries(channelPerf)
      .sort((a, b) => b[1].engagement_rate - a[1].engagement_rate)[0];
    
    if (bestChannel) {
      recommendations.push(`${bestChannel[0]} shows highest engagement rate at ${(bestChannel[1].engagement_rate * 100).toFixed(0)}%`);
    }

    return recommendations;
  }

  // Subscribe to timing recommendations
  onRetrainingNeeded(callback: (contactId: string) => void): () => void {
    this.on('retrain-needed', callback);
    return () => this.off('retrain-needed', callback);
  }
}

export default PredictiveTimingEngine;