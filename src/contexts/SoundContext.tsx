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
    return saved === null ? false : saved === 'true';
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

  // Update soundManager theme when theme changes
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    if (currentTheme && soundEnabled && performanceMode !== 'silent') {
      // All themes now use luxury sounds
      soundManager.setTheme(currentTheme.id);
    }
  }, [getCurrentTheme, soundEnabled, performanceMode]);

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