// Combined call vault mock data for demo mode
import { dentalCalls } from './dentalCalls';
import { aestheticCalls } from './aestheticCalls';
import { DemoCall } from './dentalCalls';

// Combine all demo calls
export const allDemoCalls: DemoCall[] = [...dentalCalls, ...aestheticCalls];

// Helper function to get calls by industry
export const getCallsByIndustry = (industry: 'dental' | 'aesthetic'): DemoCall[] => {
  return allDemoCalls.filter(call => call.industry === industry);
};

// Helper function to get calls by outcome
export const getCallsByOutcome = (outcome: 'closed' | 'follow-up' | 'objection' | 'no-decision'): DemoCall[] => {
  return allDemoCalls.filter(call => call.outcome === outcome);
};

// Generate waveform data for audio visualization
export const generateWaveformData = (length: number = 100): number[] => {
  return Array.from({ length }, () => 0.2 + Math.random() * 0.8);
};

// Format duration from seconds to MM:SS
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Get random greeting based on time of day
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Simulate real-time transcription with typewriter effect
export class TranscriptionSimulator {
  private text: string;
  private speed: number;
  private callback: (text: string) => void;
  private currentIndex: number = 0;
  private timer: NodeJS.Timeout | null = null;

  constructor(text: string, speed: number = 50, callback: (text: string) => void) {
    this.text = text;
    this.speed = speed;
    this.callback = callback;
  }

  start() {
    this.timer = setInterval(() => {
      if (this.currentIndex < this.text.length) {
        this.currentIndex++;
        this.callback(this.text.slice(0, this.currentIndex));
      } else {
        this.stop();
      }
    }, this.speed);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset() {
    this.currentIndex = 0;
    this.stop();
  }
}

// Mock audio player for demo mode
export class MockAudioPlayer {
  private duration: number;
  private onTimeUpdate: (time: number) => void;
  private onEnded: () => void;
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    duration: number,
    onTimeUpdate: (time: number) => void,
    onEnded: () => void
  ) {
    this.duration = duration;
    this.onTimeUpdate = onTimeUpdate;
    this.onEnded = onEnded;
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.timer = setInterval(() => {
        if (this.currentTime < this.duration) {
          this.currentTime++;
          this.onTimeUpdate(this.currentTime);
        } else {
          this.pause();
          this.onEnded();
        }
      }, 1000);
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  seek(time: number) {
    this.currentTime = Math.min(Math.max(0, time), this.duration);
    this.onTimeUpdate(this.currentTime);
  }

  reset() {
    this.pause();
    this.currentTime = 0;
    this.onTimeUpdate(0);
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export type { DemoCall } from './dentalCalls';