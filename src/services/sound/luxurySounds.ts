// Simplified luxury sound system
// Core principle: Less is more. Subtle, refined, purposeful.

export interface LuxurySound {
  url: string;
  volume: number; // 0-1, allows for even more subtle sounds
  description: string;
}

// Minimal set of luxury sounds - think Hermès, Cartier, Rolex
export const LUXURY_SOUNDS: Record<string, LuxurySound> = {
  // Primary interaction - like touching fine leather
  'click': {
    url: '/sounds/themes/luxury-hermes/crystal-gentle.wav',
    volume: 0.3,
    description: 'Subtle crystal touch'
  },
  
  // Success - champagne bubble pop
  'success': {
    url: '/sounds/themes/luxury-hermes/champagne-pop.mp3',
    volume: 0.4,
    description: 'Elegant completion'
  },
  
  // Navigation - silk fabric movement
  'navigate': {
    url: '/sounds/themes/luxury-hermes/leather-soft.wav',
    volume: 0.25,
    description: 'Smooth transition'
  },
  
  // Error - gentle chime, not jarring
  'error': {
    url: '/sounds/themes/luxury-hermes/notification-bell-2.wav',
    volume: 0.35,
    description: 'Refined alert'
  },
  
  // Hover - barely audible presence
  'hover': {
    url: '/sounds/themes/luxury-hermes/bell-elegant.wav',
    volume: 0.15,
    description: 'Whisper soft'
  }
};

// Map legacy sound IDs to new luxury sounds
export const LEGACY_MAPPING: Record<string, keyof typeof LUXURY_SOUNDS> = {
  // UI sounds
  'ui-click-primary': 'click',
  'ui-click-secondary': 'click',
  'ui-click-metal': 'click',
  'ui-hover': 'hover',
  'ui-toggle': 'click',
  
  // Navigation
  'navigation-forward': 'navigate',
  'navigation-back': 'navigate',
  
  // Notifications
  'notification-success': 'success',
  'notification-error': 'error',
  'notification-info': 'click',
  'notification-urgent': 'error',
  
  // Other
  'gauge-tick': 'hover',
  'theme-switch': 'navigate'
};

// Get luxury sound configuration
export function getLuxurySound(soundId: string): LuxurySound | null {
  // First check if it's a direct luxury sound
  if (LUXURY_SOUNDS[soundId]) {
    return LUXURY_SOUNDS[soundId];
  }
  
  // Then check legacy mapping
  const mappedId = LEGACY_MAPPING[soundId];
  if (mappedId && LUXURY_SOUNDS[mappedId]) {
    return LUXURY_SOUNDS[mappedId];
  }
  
  // No sound for unmapped IDs - silence is luxury
  return null;
}