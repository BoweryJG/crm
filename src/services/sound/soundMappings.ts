// Sound mappings with fallbacks
// This ensures sounds always work even if theme-specific versions are missing

export interface SoundMapping {
  primary: string;
  fallbacks: string[];
  category: 'ui' | 'notification' | 'navigation' | 'feedback';
}

// Core sound mappings - these MUST exist
export const CORE_SOUNDS: Record<string, SoundMapping> = {
  // UI Sounds - Using actual existing files
  'ui-click-primary': {
    primary: '/sounds/test-click.mp3', // This file exists
    fallbacks: ['/sounds/core/fallback-click.mp3', '/sounds/core/ui-click-primary.wav'],
    category: 'ui'
  },
  'ui-click-secondary': {
    primary: '/sounds/core/ui-click-secondary.mp3', // This file exists
    fallbacks: ['/sounds/core/ui-click-secondary.wav', '/sounds/test-click.mp3'],
    category: 'ui'
  },
  'ui-hover': {
    primary: '/sounds/core/ui-hover.wav', // This file exists
    fallbacks: ['/sounds/test-click.mp3'],
    category: 'ui'
  },
  'ui-toggle': {
    primary: '/sounds/core/ui-toggle.mp3', // This file exists
    fallbacks: ['/sounds/core/ui-toggle.wav', '/sounds/test-click.mp3'],
    category: 'ui'
  },
  
  // Navigation
  'navigation-forward': {
    primary: '/sounds/core/navigation-forward.wav',
    fallbacks: ['/sounds/core/ui-click-primary.wav'],
    category: 'navigation'
  },
  'navigation-back': {
    primary: '/sounds/core/navigation-back.wav',
    fallbacks: ['/sounds/core/ui-click-secondary.wav'],
    category: 'navigation'
  },
  
  // Notifications
  'notification-success': {
    primary: '/sounds/core/notification-success.wav',
    fallbacks: ['/sounds/core/ui-toggle.wav'],
    category: 'notification'
  },
  'notification-error': {
    primary: '/sounds/core/notification-error.wav',
    fallbacks: ['/sounds/core/ui-click-secondary.wav'],
    category: 'notification'
  },
  'notification-urgent': {
    primary: '/sounds/core/notification-error.wav', // Use error sound as urgent
    fallbacks: ['/sounds/core/notification-error.wav'],
    category: 'notification'
  },
  
  // Feedback
  'gauge-tick': {
    primary: '/sounds/core/gauge-tick.wav',
    fallbacks: ['/sounds/core/ui-click-secondary.wav'],
    category: 'feedback'
  }
};

// Theme-specific sound overrides - using actual existing files
export const THEME_SOUND_OVERRIDES: Record<string, Partial<Record<string, string>>> = {
  'boeing-747': {
    'ui-click-primary': '/sounds/themes/boeing-747/boeing-button-press.mp3',
    'ui-toggle': '/sounds/themes/boeing-747/boeing-autopilot-engage.mp3',
    'notification-success': '/sounds/themes/boeing-747/boeing-altitude-alert.mp3',
  },
  'f16-viper': {
    'ui-click-primary': '/sounds/themes/f16-viper/f16-radar-ping.mp3',
    'ui-toggle': '/sounds/themes/f16-viper/f16-system-ready.mp3',
    'notification-success': '/sounds/themes/f16-viper/f16-missile-lock.mp3',
  },
  // Fallback to core sounds for other themes
};

// Get sound URL with fallback support
export function getSoundUrl(soundId: string, themeId?: string): string[] {
  const urls: string[] = [];
  
  // First try theme-specific sound if theme is provided
  if (themeId && THEME_SOUND_OVERRIDES[themeId]?.[soundId]) {
    urls.push(THEME_SOUND_OVERRIDES[themeId][soundId]!);
  }
  
  // Then add core sound mapping
  const coreMapping = CORE_SOUNDS[soundId];
  if (coreMapping) {
    urls.push(coreMapping.primary);
    urls.push(...coreMapping.fallbacks);
  }
  
  // Final fallback to test click
  if (urls.length === 0) {
    urls.push('/sounds/test-click.mp3');
  }
  
  return urls;
}

// Check if sound exists (for preloading)
export async function checkSoundExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Get first available sound URL from list
export async function getFirstAvailableSound(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    if (await checkSoundExists(url)) {
      return url;
    }
  }
  return null;
}