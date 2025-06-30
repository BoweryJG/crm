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
    primary: '/sounds/core/ui-click-primary.wav', // This file exists
    fallbacks: ['/sounds/core/ui-click-secondary.wav', '/sounds/core/ui-click-metal.wav'],
    category: 'ui'
  },
  'ui-click-metal': {
    primary: '/sounds/core/ui-click-metal.wav', // Metal click sound
    fallbacks: ['/sounds/core/ui-click-primary.wav', '/sounds/core/ui-click-secondary.wav'],
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
    'ui-click-primary': '/sounds/themes/boeing-747/boeing-button-press.wav',
    'ui-click-secondary': '/sounds/themes/boeing-747/ui-primary-button-1.wav',
    'ui-hover': '/sounds/themes/boeing-747/ui-secondary-beep-1.wav',
    'ui-toggle': '/sounds/themes/boeing-747/boeing-switch-variant.wav',
    'navigation-forward': '/sounds/themes/boeing-747/navigation-engage-1.wav',
    'navigation-back': '/sounds/themes/boeing-747/navigation-ping-1.wav',
    'notification-success': '/sounds/themes/boeing-747/boeing-altitude-alert.wav',
    'notification-error': '/sounds/themes/boeing-747/boeing-warning-soft.wav',
    'notification-info': '/sounds/themes/boeing-747/notification-ready-1.wav',
    'gauge-tick': '/sounds/themes/boeing-747/ui-secondary-interface-1.wav',
    'theme-switch': '/sounds/themes/boeing-747/boeing-autopilot-engage.mp3',
  },
  'f16-viper': {
    'ui-click-primary': '/sounds/themes/f16-viper/f16-radar-ping.mp3',
    'ui-click-secondary': '/sounds/themes/f16-viper/f16-radar-short.wav',
    'ui-hover': '/sounds/themes/f16-viper/ui-primary-tactical-1.wav',
    'ui-toggle': '/sounds/themes/f16-viper/f16-system-ready.wav',
    'navigation-forward': '/sounds/themes/f16-viper/navigation-update-1.wav',
    'navigation-back': '/sounds/themes/f16-viper/ui-secondary-online-1.wav',
    'notification-success': '/sounds/themes/f16-viper/f16-missile-lock.wav',
    'notification-error': '/sounds/themes/f16-viper/f16-tactical-soft.wav',
    'notification-info': '/sounds/themes/f16-viper/notification-lock-1.wav',
    'gauge-tick': '/sounds/themes/f16-viper/ui-primary-radar-1.wav',
    'theme-switch': '/sounds/themes/f16-viper/f16-target-lock.mp3',
  },
  'luxury-hermes': {
    'ui-click-primary': '/sounds/themes/luxury-hermes/crystal-ting.mp3',
    'ui-click-secondary': '/sounds/themes/luxury-hermes/crystal-gentle.wav',
    'ui-hover': '/sounds/themes/luxury-hermes/bell-elegant.wav',
    'ui-toggle': '/sounds/themes/luxury-hermes/ui-secondary-leather-1.wav',
    'navigation-forward': '/sounds/themes/luxury-hermes/hermes-navigation.mp3',
    'navigation-back': '/sounds/themes/luxury-hermes/leather-soft.wav',
    'notification-success': '/sounds/themes/luxury-hermes/champagne-pop.mp3',
    'notification-error': '/sounds/themes/luxury-hermes/notification-bell-2.wav',
    'notification-info': '/sounds/themes/luxury-hermes/notification-chime-1.wav',
    'gauge-tick': '/sounds/themes/luxury-hermes/ui-primary-jewelry-1.wav',
    'theme-switch': '/sounds/themes/luxury-hermes/hermes-achievement.mp3',
  },
  'space-scifi': {
    'ui-click-primary': '/sounds/themes/space-scifi/space-hologram-touch.mp3',
    'ui-click-secondary': '/sounds/themes/space-scifi/interface-soft.wav',
    'ui-hover': '/sounds/themes/space-scifi/ui-primary-interface-1.wav',
    'ui-toggle': '/sounds/themes/space-scifi/ui-secondary-scanner-1.wav',
    'navigation-forward': '/sounds/themes/space-scifi/success-mission-1.wav',
    'navigation-back': '/sounds/themes/space-scifi/ui-primary-startup-1.wav',
    'notification-success': '/sounds/themes/space-scifi/computer-boot.wav',
    'notification-error': '/sounds/themes/space-scifi/space-critical-alert.mp3',
    'notification-info': '/sounds/themes/space-scifi/notification-ready-1.wav',
    'gauge-tick': '/sounds/themes/space-scifi/ui-primary-digital-1.wav',
    'theme-switch': '/sounds/themes/space-scifi/space-warp-drive.mp3',
  },
  'medical-surgical': {
    'ui-click-primary': '/sounds/themes/medical-surgical/med-instrument-select.mp3',
    'ui-click-secondary': '/sounds/themes/medical-surgical/equipment-gentle.wav',
    'ui-hover': '/sounds/themes/medical-surgical/ui-primary-equipment-1.wav',
    'ui-toggle': '/sounds/themes/medical-surgical/ui-secondary-monitor-1.wav',
    'navigation-forward': '/sounds/themes/medical-surgical/ui-primary-surgical-1.wav',
    'navigation-back': '/sounds/themes/medical-surgical/ui-secondary-clinical-1.wav',
    'notification-success': '/sounds/themes/medical-surgical/med-procedure-complete.mp3',
    'notification-error': '/sounds/themes/medical-surgical/monitor-soft.wav',
    'notification-info': '/sounds/themes/medical-surgical/notification-patient-1.wav',
    'gauge-tick': '/sounds/themes/medical-surgical/notification-chime-1.wav',
    'theme-switch': '/sounds/themes/medical-surgical/med-patient-update.mp3',
  },
  'corporate-professional': {
    'ui-click-primary': '/sounds/themes/corporate-professional/click-professional.wav',
    'ui-click-secondary': '/sounds/themes/corporate-professional/click-subtle.wav',
    'ui-hover': '/sounds/themes/corporate-professional/ui-secondary-keyboard-1.wav',
    'ui-toggle': '/sounds/themes/corporate-professional/corp-subtle-click.mp3',
    'navigation-forward': '/sounds/themes/corporate-professional/ui-primary-click-1.wav',
    'navigation-back': '/sounds/themes/corporate-professional/ui-primary-click-2.wav',
    'notification-success': '/sounds/themes/corporate-professional/chime-elegant.wav',
    'notification-error': '/sounds/themes/corporate-professional/error-business-1.wav',
    'notification-info': '/sounds/themes/corporate-professional/notification-executive-1.wav',
    'gauge-tick': '/sounds/themes/corporate-professional/corp-notification.mp3',
    'theme-switch': '/sounds/themes/corporate-professional/corp-achievement.mp3',
  },
  'formula1-racing': {
    'ui-click-primary': '/sounds/themes/formula1-racing/f1-paddle-shift.mp3',
    'ui-click-secondary': '/sounds/themes/formula1-racing/gear-click.wav',
    'ui-hover': '/sounds/themes/formula1-racing/ui-secondary-radio-1.wav',
    'ui-toggle': '/sounds/themes/formula1-racing/ui-secondary-telemetry-1.wav',
    'navigation-forward': '/sounds/themes/formula1-racing/ui-primary-gear-1.wav',
    'navigation-back': '/sounds/themes/formula1-racing/notification-pit-1.wav',
    'notification-success': '/sounds/themes/formula1-racing/radio-short.wav',
    'notification-error': '/sounds/themes/formula1-racing/error-warning-1.wav',
    'notification-info': '/sounds/themes/formula1-racing/notification-alert-1.wav',
    'gauge-tick': '/sounds/themes/formula1-racing/success-lap-1.wav',
    'theme-switch': '/sounds/themes/formula1-racing/f1-race-start.mp3',
  },
  'rolex-watchmaking': {
    'ui-click-primary': '/sounds/themes/rolex-watchmaking/rolex-bezel-click.mp3',
    'ui-click-secondary': '/sounds/themes/rolex-watchmaking/mechanism-click.wav',
    'ui-hover': '/sounds/themes/rolex-watchmaking/tick-precise.wav',
    'ui-toggle': '/sounds/themes/rolex-watchmaking/ui-secondary-wind-1.wav',
    'navigation-forward': '/sounds/themes/rolex-watchmaking/ui-primary-mechanism-1.wav',
    'navigation-back': '/sounds/themes/rolex-watchmaking/ui-primary-tick-1.wav',
    'notification-success': '/sounds/themes/rolex-watchmaking/rolex-certification.mp3',
    'notification-error': '/sounds/themes/rolex-watchmaking/error-mechanical-1.wav',
    'notification-info': '/sounds/themes/rolex-watchmaking/notification-chime-1.wav',
    'gauge-tick': '/sounds/themes/rolex-watchmaking/rolex-tick.mp3',
    'theme-switch': '/sounds/themes/rolex-watchmaking/rolex-perpetual.mp3',
  },
  'shelbygt500cartier': {
    'ui-click-primary': '/sounds/themes/shelbygt500cartier/manual-gear-shift.mp3',
    'ui-click-secondary': '/sounds/themes/shelbygt500cartier/cartier-precision.mp3',
    'ui-hover': '/sounds/themes/shelbygt500cartier/vintage-switchboard.mp3',
    'ui-toggle': '/sounds/themes/shelbygt500cartier/rotary-dial.mp3',
    'navigation-forward': '/sounds/themes/shelbygt500cartier/acceleration-burst.mp3',
    'navigation-back': '/sounds/themes/shelbygt500cartier/tire-burnout.mp3',
    'notification-success': '/sounds/themes/shelbygt500cartier/shelby-engine-roar.mp3',
    'notification-error': '/sounds/themes/shelbygt500cartier/telephone-operator.mp3',
    'notification-info': '/sounds/themes/shelbygt500cartier/vintage-luxury.mp3',
    'gauge-tick': '/sounds/themes/shelbygt500cartier/mechanical-movement.mp3',
    'theme-switch': '/sounds/themes/shelbygt500cartier/cobra-exhaust.mp3',
  },
  'luxury-premium': {
    'ui-click-primary': '/sounds/themes/luxury-premium/luxury-toggle.mp3',
    'ui-click-secondary': '/sounds/themes/luxury-premium/luxury-notification.mp3',
    'notification-success': '/sounds/themes/luxury-premium/luxury-success.mp3',
  },
};

// Export for legacy compatibility
export const themeOverrides = THEME_SOUND_OVERRIDES;

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
