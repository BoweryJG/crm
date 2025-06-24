// The Omnisensory Experience Engine™ - Core Sound Manager
import { SoundCache } from './SoundCache';

export type SoundCategory = 
  | 'ui-primary' 
  | 'ui-secondary' 
  | 'navigation' 
  | 'success' 
  | 'error' 
  | 'notification'
  | 'gauge'
  | 'theme-switch'
  | 'startup'
  | 'ambient';

export type PerformanceMode = 'cinema' | 'office' | 'silent' | 'asmr';

export interface SoundConfig {
  id: string;
  url: string;
  category: SoundCategory;
  volume?: number;
  theme?: string;
  preload?: boolean;
  variations?: string[]; // Alternative sounds to prevent repetition
  spatial?: boolean; // 3D audio positioning
}

export interface ThemeSoundPack {
  id: string;
  name: string;
  sounds: Record<string, SoundConfig>;
  ambient?: SoundConfig;
  startupSequence?: string[]; // Sound IDs to play in order
}

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private cache: SoundCache;
  private masterVolume: number = 0.7;
  private categoryVolumes: Record<SoundCategory, number> = {
    'ui-primary': 1.0,
    'ui-secondary': 0.8,
    'navigation': 0.9,
    'success': 1.0,
    'error': 1.0,
    'notification': 1.0,
    'gauge': 0.7,
    'theme-switch': 0.9,
    'startup': 1.0,
    'ambient': 0.3,
  };
  private performanceMode: PerformanceMode = 'office';
  private currentTheme: string = 'boeing-747';
  private playingSounds: Map<string, AudioBufferSourceNode> = new Map();
  private lastPlayedTimes: Map<string, number> = new Map();
  private enabled: boolean = true;

  private constructor() {
    this.cache = new SoundCache();
    this.initializeAudioContext();
    this.loadSavedPreferences();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Initialize cache after audio context
      await this.cache.initialize();
      
      // Resume context on user interaction (required for some browsers)
      const resumeContext = async () => {
        if (this.audioContext?.state === 'suspended') {
          this.audioContext.resume();
        }
        document.removeEventListener('click', resumeContext);
        document.removeEventListener('touchstart', resumeContext);
      };
      
      document.addEventListener('click', resumeContext);
      document.addEventListener('touchstart', resumeContext);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private loadSavedPreferences() {
    const saved = localStorage.getItem('crm-sound-preferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        this.masterVolume = prefs.masterVolume ?? 0.7;
        this.categoryVolumes = { ...this.categoryVolumes, ...prefs.categoryVolumes };
        this.performanceMode = prefs.performanceMode ?? 'office';
        this.enabled = prefs.enabled ?? true;
      } catch (e) {
        console.warn('Failed to load sound preferences:', e);
      }
    }
  }

  private savePreferences() {
    localStorage.setItem('crm-sound-preferences', JSON.stringify({
      masterVolume: this.masterVolume,
      categoryVolumes: this.categoryVolumes,
      performanceMode: this.performanceMode,
      enabled: this.enabled,
    }));
  }

  async play(
    soundId: string, 
    options: {
      volume?: number;
      pitch?: number;
      delay?: number;
      variations?: boolean;
    } = {}
  ): Promise<void> {
    if (!this.enabled || this.performanceMode === 'silent' || !this.audioContext) {
      return;
    }

    // Intelligent sound spacing - prevent same sound within 100ms
    const lastPlayed = this.lastPlayedTimes.get(soundId) || 0;
    const now = Date.now();
    if (now - lastPlayed < 100) {
      return;
    }
    this.lastPlayedTimes.set(soundId, now);

    try {
      // Get sound buffer with fallback support
      const buffer = await this.cache.getSoundBuffer(soundId, this.currentTheme);
      if (!buffer) {
        // Silently fail - fallbacks have already been tried
        return;
      }
      
      // Get config for volume settings
      const config = await this.cache.getSoundConfig(soundId, this.currentTheme);
      if (!config) {
        return;
      }

      // Create audio nodes
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      // Calculate volume
      const categoryVolume = this.categoryVolumes[config.category] ?? 1.0;
      const finalVolume = this.masterVolume * categoryVolume * (options.volume ?? config.volume ?? 1.0);
      
      // Apply performance mode adjustments
      const modeMultiplier = this.getPerformanceModeMultiplier();
      gainNode.gain.value = finalVolume * modeMultiplier;

      // Connect nodes
      source.buffer = buffer;
      source.connect(gainNode);
      
      // Add spatial audio if supported and enabled
      if (config.spatial && this.performanceMode === 'cinema') {
        const panner = this.audioContext.createPanner();
        gainNode.connect(panner);
        panner.connect(this.audioContext.destination);
        // Set 3D position based on UI element location
        panner.setPosition(0, 0, 0); // TODO: Get from element position
      } else {
        gainNode.connect(this.audioContext.destination);
      }

      // Apply pitch if requested
      if (options.pitch) {
        source.playbackRate.value = options.pitch;
      }

      // Schedule playback
      const startTime = this.audioContext.currentTime + (options.delay ?? 0) / 1000;
      source.start(startTime);

      // Track playing sounds
      const id = `${soundId}-${now}`;
      this.playingSounds.set(id, source);
      source.onended = () => {
        this.playingSounds.delete(id);
      };

    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async playSequence(soundIds: string[], interval: number = 100): Promise<void> {
    for (let i = 0; i < soundIds.length; i++) {
      await this.play(soundIds[i], { delay: i * interval });
    }
  }

  async playThemeStartup(themeId: string): Promise<void> {
    const pack = await this.cache.getThemeSoundPack(themeId);
    if (pack?.startupSequence) {
      await this.playSequence(pack.startupSequence, 200);
    }
  }

  setTheme(themeId: string) {
    // Map theme IDs to sound pack IDs
    const soundPackMap: Record<string, string> = {
      'boeing-cockpit': 'boeing-747',
      'boeing-cockpit-enhanced': 'boeing-747',
      'airbus-modern': 'boeing-747',
      'gulfstream-elite': 'boeing-747',
      'cessna-classic': 'boeing-747',
      'f16-viper': 'f16-viper',
      'cartier-gold': 'luxury-hermes',
      'cartier-gold-enhanced': 'luxury-hermes',
      'rolex-platinum': 'rolex-watchmaking',
      'hermes-orange': 'luxury-hermes',
      'tiffany-blue': 'luxury-hermes',
      'chanel-noir': 'luxury-hermes',
      'chanel-noir-enhanced': 'luxury-hermes',
      'dior-rouge': 'luxury-hermes',
      'ysl-purple': 'luxury-hermes',
      'mac-studio': 'luxury-hermes',
      'sephora-glow': 'luxury-hermes',
      'ulta-beauty': 'luxury-hermes',
      'glossier-pink': 'luxury-hermes',
      'surgical-precision': 'medical-surgical',
      'surgical-precision-enhanced': 'medical-surgical',
      'dental-clean': 'medical-surgical',
      'aesthetic-spa': 'medical-surgical',
      'space-exploration': 'space-scifi',
      'cyber-neon': 'space-scifi',
      'cyber-neon-enhanced': 'space-scifi',
      'minimal-zen': 'corporate-professional',
      'gradient-sunset': 'space-scifi',
      'corporate-blue': 'corporate-professional',
      'forest-green': 'space-scifi',
      'forest-sanctuary': 'space-scifi',
      'ocean-depths': 'space-scifi',
      'gallery-dominance': 'luxury-hermes',
      'gallery-dominance-pro': 'luxury-hermes'
    };

    const soundPackId = soundPackMap[themeId] || 'boeing-747';
    this.currentTheme = soundPackId;
    // Preload essential sounds for the new theme
    this.cache.preloadTheme(soundPackId);
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.savePreferences();
  }

  setCategoryVolume(category: SoundCategory, volume: number) {
    this.categoryVolumes[category] = Math.max(0, Math.min(1, volume));
    this.savePreferences();
  }

  setPerformanceMode(mode: PerformanceMode) {
    this.performanceMode = mode;
    this.savePreferences();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
    this.savePreferences();
  }

  private getPerformanceModeMultiplier(): number {
    switch (this.performanceMode) {
      case 'cinema': return 1.2;
      case 'office': return 0.6;
      case 'asmr': return 1.5;
      default: return 0;
    }
  }

  stopAll() {
    this.playingSounds.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.playingSounds.clear();
  }

  // Haptic feedback for mobile devices
  async playHaptic(pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error') {
    if ('vibrate' in navigator) {
      switch (pattern) {
        case 'light': navigator.vibrate(10); break;
        case 'medium': navigator.vibrate(25); break;
        case 'heavy': navigator.vibrate(50); break;
        case 'success': navigator.vibrate([10, 20, 10]); break;
        case 'error': navigator.vibrate([50, 100, 50]); break;
      }
    }
  }
}

export const soundManager = SoundManager.getInstance();