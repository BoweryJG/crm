import React, { createContext, useContext, useEffect, useState } from 'react';
import { SoundCache } from '../services/sound/SoundCache';
import { useThemeContext } from '../themes/ThemeContext';
import { soundManager } from '../services/sound/SoundManager';

interface SoundContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  performanceMode: 'cinema' | 'office' | 'asmr' | 'silent';
  setPerformanceMode: (mode: 'cinema' | 'office' | 'asmr' | 'silent') => void;
  soundCache: SoundCache;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: React.ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const { getCurrentTheme } = useThemeContext();
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('crm-sound-enabled');
    return saved === null ? true : saved === 'true';
  });
  
  const [masterVolume, setMasterVolume] = useState(() => {
    const saved = localStorage.getItem('crm-master-volume');
    return saved ? parseFloat(saved) : 0.7;
  });
  
  const [performanceMode, setPerformanceMode] = useState<'cinema' | 'office' | 'asmr' | 'silent'>(() => {
    const saved = localStorage.getItem('crm-performance-mode');
    return (saved as any) || 'office';
  });

  const [soundCache] = useState(() => new SoundCache());

  // Initialize soundManager on mount
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    soundManager.setMasterVolume(masterVolume);
    soundManager.setPerformanceMode(performanceMode);
  }, []);

  // Save preferences and update soundManager
  useEffect(() => {
    localStorage.setItem('crm-sound-enabled', String(soundEnabled));
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('crm-master-volume', String(masterVolume));
    soundManager.setMasterVolume(masterVolume);
  }, [masterVolume]);

  useEffect(() => {
    localStorage.setItem('crm-performance-mode', performanceMode);
    soundManager.setPerformanceMode(performanceMode);
  }, [performanceMode]);

  // Load theme sounds when theme changes
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    if (currentTheme && soundEnabled && performanceMode !== 'silent') {
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

      const soundPackId = soundPackMap[currentTheme.id] || 'boeing-747';
      soundCache.getThemeSoundPack(soundPackId);
      soundManager.setTheme(currentTheme.id); // Set theme in soundManager
    }
  }, [getCurrentTheme, soundEnabled, performanceMode, soundCache]);

  const value: SoundContextValue = {
    soundEnabled,
    setSoundEnabled,
    masterVolume,
    setMasterVolume,
    performanceMode,
    setPerformanceMode,
    soundCache
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};