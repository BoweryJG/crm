// Smart Sound Caching System with Fallback Support
import { SoundConfig, ThemeSoundPack } from './SoundManager';
import { getSoundUrl, CORE_SOUNDS } from './soundMappings';

export class SoundCache {
  private cache: Map<string, AudioBuffer> = new Map();
  private loading: Map<string, Promise<AudioBuffer | null>> = new Map();
  private soundConfigs: Map<string, SoundConfig> = new Map();
  private themePacks: Map<string, ThemeSoundPack> = new Map();
  private audioContext: AudioContext;
  private maxCacheSize: number = 50 * 1024 * 1024; // 50MB reduced for performance
  private currentCacheSize: number = 0;
  private failedSounds: Set<string> = new Set(); // Track failed sounds to avoid retrying

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Don't preload sounds on construction - wait for user interaction
  }

  // Initialize sounds after user interaction (for Chrome autoplay policy)
  async initialize() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    // Only preload the most essential sounds
    await this.preloadEssentialSounds();
  }

  private async preloadEssentialSounds() {
    const essentialSounds = ['ui-click-primary', 'ui-click-secondary', 'ui-toggle'];
    
    for (const soundId of essentialSounds) {
      try {
        await this.getSoundBuffer(soundId);
      } catch (error) {
        console.warn(`Failed to preload ${soundId}:`, error);
      }
    }
  }

  async getSoundBuffer(soundId: string, themeId?: string): Promise<AudioBuffer | null> {
    const cacheKey = themeId ? `${themeId}-${soundId}` : soundId;
    
    // Return cached version if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Return existing loading promise if already loading
    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey)!;
    }

    // Skip if we've already tried and failed
    if (this.failedSounds.has(cacheKey)) {
      return null;
    }

    // Start loading with fallback support
    const loadPromise = this.loadSoundWithFallback(soundId, themeId);
    this.loading.set(cacheKey, loadPromise);

    try {
      const buffer = await loadPromise;
      this.loading.delete(cacheKey);
      
      if (buffer) {
        this.addToCache(cacheKey, buffer);
      } else {
        this.failedSounds.add(cacheKey);
      }
      
      return buffer;
    } catch (error) {
      this.loading.delete(cacheKey);
      this.failedSounds.add(cacheKey);
      return null;
    }
  }

  private async loadSoundWithFallback(soundId: string, themeId?: string): Promise<AudioBuffer | null> {
    const urls = getSoundUrl(soundId, themeId);
    
    for (const url of urls) {
      try {
        const buffer = await this.loadSound(url);
        if (buffer) {
          return buffer;
        }
      } catch (error) {
        console.warn(`Failed to load sound from ${url}:`, error);
      }
    }
    
    console.warn(`All fallbacks failed for sound: ${soundId}`);
    return null;
  }

  private async loadSound(url: string): Promise<AudioBuffer | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      return audioBuffer;
    } catch (error) {
      // Don't log encoding errors - they're too noisy
      if (error instanceof Error && !error.message.includes('Unable to decode')) {
        console.warn(`Error loading sound ${url}:`, error.message);
      }
      return null;
    }
  }

  private addToCache(key: string, buffer: AudioBuffer) {
    const bufferSize = buffer.length * buffer.numberOfChannels * 4; // 32-bit float
    
    // Check cache size and evict if necessary
    if (this.currentCacheSize + bufferSize > this.maxCacheSize) {
      this.evictOldestEntries(bufferSize);
    }

    this.cache.set(key, buffer);
    this.currentCacheSize += bufferSize;
  }

  private evictOldestEntries(requiredSpace: number) {
    const entries = Array.from(this.cache.entries());
    let freedSpace = 0;
    let i = 0;

    while (freedSpace < requiredSpace && i < entries.length) {
      const [key, buffer] = entries[i];
      const bufferSize = buffer.length * buffer.numberOfChannels * 4;
      
      this.cache.delete(key);
      this.currentCacheSize -= bufferSize;
      freedSpace += bufferSize;
      i++;
    }
  }

  async getSoundConfig(soundId: string, themeId?: string): Promise<SoundConfig | null> {
    // Check if we have a stored config
    if (this.soundConfigs.has(soundId)) {
      return this.soundConfigs.get(soundId)!;
    }

    // Generate config from our mappings
    const mapping = CORE_SOUNDS[soundId];
    if (mapping) {
      const config: SoundConfig = {
        id: soundId,
        url: mapping.primary,
        category: mapping.category as any,
        volume: 0.5,
      };
      this.soundConfigs.set(soundId, config);
      return config;
    }

    return null;
  }

  async getThemeSoundPack(themeId: string): Promise<ThemeSoundPack | null> {
    // For now, return null - theme packs are optional
    return null;
  }

  async preloadTheme(themeId: string): Promise<void> {
    // Theme preloading is now optional and lightweight
    const essentialSounds = ['ui-click-primary', 'ui-toggle'];
    
    for (const soundId of essentialSounds) {
      try {
        await this.getSoundBuffer(soundId, themeId);
      } catch (error) {
        // Silently fail - theme sounds are optional
      }
    }
  }

  clearCache() {
    this.cache.clear();
    this.loading.clear();
    this.failedSounds.clear();
    this.currentCacheSize = 0;
  }

  clearTheme(themeId: string) {
    // Clear theme-specific sounds from cache
    const keysToDelete: string[] = [];
    
    Array.from(this.cache.keys()).forEach(key => {
      if (key.startsWith(`${themeId}-`)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      const buffer = this.cache.get(key);
      if (buffer) {
        const bufferSize = buffer.length * buffer.numberOfChannels * 4;
        this.currentCacheSize -= bufferSize;
        this.cache.delete(key);
      }
    });
  }

  getCacheInfo() {
    return {
      entries: this.cache.size,
      sizeInMB: (this.currentCacheSize / (1024 * 1024)).toFixed(2),
      maxSizeInMB: (this.maxCacheSize / (1024 * 1024)).toFixed(2),
      failedSounds: Array.from(this.failedSounds),
    };
  }
}