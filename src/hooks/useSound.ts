// React Hook for Easy Sound Integration
import { useCallback, useEffect, useRef } from 'react';
import { soundManager } from '../services/sound/SoundManager';
import { useThemeContext } from '../themes/ThemeContext';

interface UseSoundOptions {
  volume?: number;
  pitch?: number;
  hover?: boolean;
  click?: boolean;
  variations?: boolean;
  haptic?: 'light' | 'medium' | 'heavy';
}

export const useSound = (soundId: string | null, options: UseSoundOptions = {}) => {
  const { themeMode } = useThemeContext();
  const lastTheme = useRef(themeMode);

  // Update sound manager theme when it changes
  useEffect(() => {
    if (themeMode !== lastTheme.current) {
      soundManager.setTheme(themeMode);
      lastTheme.current = themeMode;
    }
  }, [themeMode]);

  const play = useCallback(async (overrideOptions?: Partial<UseSoundOptions>) => {
    if (!soundId) return;
    
    const finalOptions = { ...options, ...overrideOptions };
    
    // Play haptic feedback if requested
    if (finalOptions.haptic) {
      soundManager.playHaptic(finalOptions.haptic);
    }
    
    // Play sound
    await soundManager.play(soundId, {
      volume: finalOptions.volume,
      pitch: finalOptions.pitch,
      variations: finalOptions.variations,
    });
  }, [soundId, options]);

  // Return handlers for common interactions
  const handlers = {
    onMouseEnter: options.hover ? () => play() : undefined,
    onClick: options.click ? () => play() : undefined,
  };

  return { play, handlers };
};

// Specialized hooks for common use cases
export const useButtonSound = (variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
  const soundMap = {
    primary: 'ui-click-primary',
    secondary: 'ui-click-secondary',
    danger: 'ui-click-danger',
  };

  return useSound(soundMap[variant], {
    click: true,
    hover: true,
    haptic: variant === 'danger' ? 'heavy' : 'light',
  });
};

export const useNavigationSound = () => {
  const forward = useSound('navigation-forward');
  const back = useSound('navigation-back');
  
  return { forward: forward.play, back: back.play };
};

export const useGaugeSound = () => {
  const tick = useSound('gauge-tick', { volume: 0.3 });
  const zone = useSound('gauge-zone-change', { volume: 0.5 });
  const peak = useSound('gauge-peak', { volume: 0.7 });
  
  return { tick: tick.play, zone: zone.play, peak: peak.play };
};

export const useNotificationSound = () => {
  const success = useSound('notification-success', { haptic: 'medium' });
  const error = useSound('notification-error', { haptic: 'heavy' });
  const info = useSound('notification-info', { haptic: 'light' });
  
  return {
    success: success.play,
    error: error.play,
    info: info.play,
  };
};

// Theme switch hook with startup sequence
export const useThemeSound = () => {
  const { themeMode } = useThemeContext();
  
  const playThemeSwitch = useCallback(async () => {
    await soundManager.play('theme-switch');
    // Play theme startup sequence after a short delay
    setTimeout(() => {
      soundManager.playThemeStartup(themeMode);
    }, 300);
  }, [themeMode]);
  
  return { playThemeSwitch };
};