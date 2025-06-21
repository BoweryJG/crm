// Smart Sound Caching System with Progressive Download
import { SoundConfig, ThemeSoundPack } from './SoundManager';

export class SoundCache {
  private cache: Map<string, AudioBuffer> = new Map();
  private loading: Map<string, Promise<AudioBuffer | null>> = new Map();
  private soundConfigs: Map<string, SoundConfig> = new Map();
  private themePacks: Map<string, ThemeSoundPack> = new Map();
  private audioContext: AudioContext;
  private maxCacheSize: number = 100 * 1024 * 1024; // 100MB
  private currentCacheSize: number = 0;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.loadCoreSounds();
  }

  private async loadCoreSounds() {
    // Load essential UI sounds that all themes use
    const coreSounds = [
      'ui-click-primary',
      'ui-hover',
      'ui-toggle',
      'ui-error',
      'ui-success',
      'navigation-forward',
      'navigation-back',
    ];

    // These would be bundled with the app (not CDN)
    coreSounds.forEach(soundId => {
      this.loadSound(`/sounds/core/${soundId}.opus`, soundId);
    });
  }

  async getSoundConfig(soundId: string, theme: string): Promise<SoundConfig | null> {
    // First check if we have a theme-specific version
    const themeKey = `${theme}:${soundId}`;
    if (this.soundConfigs.has(themeKey)) {
      return this.soundConfigs.get(themeKey)!;
    }

    // Fall back to core sound
    if (this.soundConfigs.has(soundId)) {
      return this.soundConfigs.get(soundId)!;
    }

    // Try to load from theme pack
    const pack = await this.getThemeSoundPack(theme);
    if (pack?.sounds[soundId]) {
      this.soundConfigs.set(themeKey, pack.sounds[soundId]);
      return pack.sounds[soundId];
    }

    return null;
  }

  async getSound(url: string): Promise<AudioBuffer | null> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Check if already loading
    if (this.loading.has(url)) {
      return this.loading.get(url)!;
    }

    // Start loading
    const loadPromise = this.loadSound(url);
    this.loading.set(url, loadPromise);

    try {
      const buffer = await loadPromise;
      this.loading.delete(url);
      return buffer;
    } catch (error) {
      this.loading.delete(url);
      throw error;
    }
  }

  private async loadSound(url: string, id?: string): Promise<AudioBuffer | null> {
    try {
      // Determine if local or CDN
      const isLocal = url.startsWith('/sounds/');
      const finalUrl = isLocal ? url : `${this.getCDNUrl()}${url}`;

      const response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error(`Failed to load sound: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Cache management
      const bufferSize = arrayBuffer.byteLength;
      if (this.currentCacheSize + bufferSize > this.maxCacheSize) {
        this.evictOldestSounds(bufferSize);
      }

      this.cache.set(url, audioBuffer);
      this.currentCacheSize += bufferSize;

      // Store config if ID provided
      if (id) {
        this.soundConfigs.set(id, {
          id,
          url,
          category: 'ui-primary', // Default, would be set properly in real implementation
        });
      }

      return audioBuffer;
    } catch (error) {
      console.error('Error loading sound:', error);
      return null;
    }
  }

  async getThemeSoundPack(themeId: string): Promise<ThemeSoundPack | null> {
    if (this.themePacks.has(themeId)) {
      return this.themePacks.get(themeId)!;
    }

    try {
      // Load theme manifest
      const response = await fetch(`/sounds/themes/${themeId}/manifest.json`);
      if (!response.ok) {
        // Try CDN
        const cdnResponse = await fetch(`${this.getCDNUrl()}/themes/${themeId}/manifest.json`);
        if (!cdnResponse.ok) {
          return null;
        }
        const pack = await cdnResponse.json();
        this.themePacks.set(themeId, pack);
        return pack;
      }

      const pack = await response.json();
      this.themePacks.set(themeId, pack);
      return pack;
    } catch (error) {
      console.error('Error loading theme sound pack:', error);
      return null;
    }
  }

  async preloadTheme(themeId: string): Promise<void> {
    const pack = await this.getThemeSoundPack(themeId);
    if (!pack) return;

    // Preload essential sounds for this theme
    const essentialSounds = [
      'theme-switch',
      'ui-click-primary',
      'ui-hover',
      'navigation-forward',
      'gauge-tick',
    ];

    for (const soundId of essentialSounds) {
      if (pack.sounds[soundId]) {
        this.getSound(pack.sounds[soundId].url);
      }
    }
  }

  private evictOldestSounds(requiredSpace: number) {
    // Simple LRU eviction - in production would track access times
    let freedSpace = 0;
    const entries = Array.from(this.cache.entries());
    
    for (const [url, buffer] of entries) {
      if (freedSpace >= requiredSpace) break;
      
      // Estimate buffer size (channels * length * bytes per sample)
      const bufferSize = buffer.numberOfChannels * buffer.length * 4;
      this.cache.delete(url);
      freedSpace += bufferSize;
      this.currentCacheSize -= bufferSize;
    }
  }

  private getCDNUrl(): string {
    // In production, this would return your CDN URL
    // For now, using local fallback
    return process.env.REACT_APP_SOUND_CDN_URL || '';
  }

  clearCache() {
    this.cache.clear();
    this.currentCacheSize = 0;
  }

  getCacheSize(): number {
    return this.currentCacheSize;
  }

  getCachedSounds(): string[] {
    return Array.from(this.cache.keys());
  }
}