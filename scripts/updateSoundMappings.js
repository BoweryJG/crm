#!/usr/bin/env node

/**
 * Update Sound Mappings and Manifests
 * Integrates newly downloaded sounds into the system
 */

const fs = require('fs');
const path = require('path');

// New sounds downloaded
const NEW_SOUNDS = {
  'boeing-747': [
    'boeing-switch-variant.wav',
    'boeing-warning-soft.wav'
  ],
  'f16-viper': [
    'f16-radar-short.wav', 
    'f16-tactical-soft.wav'
  ],
  'luxury-hermes': [
    'bell-elegant.wav',
    'crystal-gentle.wav',
    'leather-soft.wav'
  ],
  'space-scifi': [
    'computer-boot.wav',
    'interface-soft.wav'
  ],
  'medical-surgical': [
    'equipment-gentle.wav',
    'monitor-soft.wav'
  ],
  'corporate-professional': [
    'chime-elegant.wav',
    'click-professional.wav',
    'click-subtle.wav'
  ],
  'formula1-racing': [
    'gear-click.wav',
    'radio-short.wav'
  ],
  'rolex-watchmaking': [
    'mechanism-click.wav',
    'tick-precise.wav'
  ]
};

class SoundSystemUpdater {
  updateManifests() {
    console.log('📝 Updating theme manifests...');
    
    for (const [themeName, soundFiles] of Object.entries(NEW_SOUNDS)) {
      const manifestPath = path.join(__dirname, '..', 'public', 'sounds', 'themes', themeName, 'manifest.json');
      
      if (!fs.existsSync(manifestPath)) {
        console.log(`⚠️  No manifest found for ${themeName}, creating one...`);
        const newManifest = {
          id: themeName,
          name: themeName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          sounds: {}
        };
        fs.writeFileSync(manifestPath, JSON.stringify(newManifest, null, 2));
      }
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      for (const soundFile of soundFiles) {
        const soundId = path.basename(soundFile, path.extname(soundFile));
        
        if (!manifest.sounds[soundId]) {
          // Determine category based on sound name
          let category = 'ui-secondary';
          if (soundId.includes('warning') || soundId.includes('alert') || soundId.includes('critical')) {
            category = 'error';
          } else if (soundId.includes('switch') || soundId.includes('click') || soundId.includes('button')) {
            category = 'ui-primary';
          } else if (soundId.includes('chime') || soundId.includes('bell') || soundId.includes('success')) {
            category = 'success';
          } else if (soundId.includes('radar') || soundId.includes('monitor') || soundId.includes('interface')) {
            category = 'notification';
          }
          
          manifest.sounds[soundId] = {
            url: `/sounds/themes/${themeName}/${soundFile}`,
            category: category,
            volume: 0.6
          };
          
          console.log(`✅ Added ${soundId} to ${themeName} manifest`);
        }
      }
      
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }
  }
  
  updateSoundMappings() {
    console.log('🔧 Updating sound mappings...');
    
    const mappingsPath = path.join(__dirname, '..', 'src', 'services', 'sound', 'soundMappings.ts');
    let mappingsContent = fs.readFileSync(mappingsPath, 'utf8');
    
    // Add new theme overrides
    const newOverrides = `
  'boeing-747': {
    'ui-click-primary': '/sounds/themes/boeing-747/boeing-button-press.wav',
    'ui-toggle': '/sounds/themes/boeing-747/boeing-switch-variant.wav',
    'notification-success': '/sounds/themes/boeing-747/boeing-altitude-alert.wav',
    'notification-error': '/sounds/themes/boeing-747/boeing-warning-soft.wav',
  },
  'f16-viper': {
    'ui-click-primary': '/sounds/themes/f16-viper/f16-radar-ping.mp3',
    'ui-click-secondary': '/sounds/themes/f16-viper/f16-radar-short.wav',
    'ui-toggle': '/sounds/themes/f16-viper/f16-system-ready.wav',
    'notification-success': '/sounds/themes/f16-viper/f16-missile-lock.wav',
    'notification-error': '/sounds/themes/f16-viper/f16-tactical-soft.wav',
  },
  'luxury-hermes': {
    'ui-click-primary': '/sounds/themes/luxury-hermes/crystal-ting.mp3',
    'ui-click-secondary': '/sounds/themes/luxury-hermes/crystal-gentle.wav',
    'ui-hover': '/sounds/themes/luxury-hermes/bell-elegant.wav',
    'notification-success': '/sounds/themes/luxury-hermes/champagne-pop.mp3',
  },
  'space-scifi': {
    'ui-click-primary': '/sounds/themes/space-scifi/space-hologram-touch.mp3',
    'ui-click-secondary': '/sounds/themes/space-scifi/interface-soft.wav',
    'notification-success': '/sounds/themes/space-scifi/computer-boot.wav',
    'notification-error': '/sounds/themes/space-scifi/space-critical-alert.mp3',
  },
  'medical-surgical': {
    'ui-click-primary': '/sounds/themes/medical-surgical/med-instrument-select.mp3',
    'ui-click-secondary': '/sounds/themes/medical-surgical/equipment-gentle.wav',
    'notification-success': '/sounds/themes/medical-surgical/med-procedure-complete.mp3',
    'notification-error': '/sounds/themes/medical-surgical/monitor-soft.wav',
  },
  'corporate-professional': {
    'ui-click-primary': '/sounds/themes/corporate-professional/click-professional.wav',
    'ui-click-secondary': '/sounds/themes/corporate-professional/click-subtle.wav',
    'notification-success': '/sounds/themes/corporate-professional/chime-elegant.wav',
  },
  'formula1-racing': {
    'ui-click-primary': '/sounds/themes/formula1-racing/f1-paddle-shift.mp3',
    'ui-click-secondary': '/sounds/themes/formula1-racing/gear-click.wav',
    'notification-success': '/sounds/themes/formula1-racing/radio-short.wav',
  },
  'rolex-watchmaking': {
    'ui-click-primary': '/sounds/themes/rolex-watchmaking/rolex-bezel-click.mp3',
    'ui-click-secondary': '/sounds/themes/rolex-watchmaking/mechanism-click.wav',
    'ui-hover': '/sounds/themes/rolex-watchmaking/tick-precise.wav',
    'notification-success': '/sounds/themes/rolex-watchmaking/rolex-certification.mp3',
  },`;
    
    // Replace the theme overrides section
    if (mappingsContent.includes('export const THEME_SOUND_OVERRIDES:')) {
      mappingsContent = mappingsContent.replace(
        /export const THEME_SOUND_OVERRIDES:[^}]+}/s,
        `export const THEME_SOUND_OVERRIDES: Record<string, Partial<Record<string, string>>> = {${newOverrides}
};`
      );
      
      fs.writeFileSync(mappingsPath, mappingsContent);
      console.log('✅ Updated sound mappings with new theme overrides');
    }
  }
  
  updateTestFile() {
    console.log('🧪 Updating test-sounds.html...');
    
    const testPath = path.join(__dirname, '..', 'public', 'sounds', 'test-sounds.html');
    let testContent = fs.readFileSync(testPath, 'utf8');
    
    // Add new sounds to test array
    const newTestSounds = [];
    for (const [themeName, soundFiles] of Object.entries(NEW_SOUNDS)) {
      for (const soundFile of soundFiles) {
        newTestSounds.push(`            '/sounds/themes/${themeName}/${soundFile}',`);
      }
    }
    
    // Insert new sounds before the closing ];
    const newSoundsSection = `
            
            // Newly downloaded sounds
${newTestSounds.join('\n')}`;
    
    testContent = testContent.replace(
      /        \];\s*$/m,
      `${newSoundsSection}
        ];`
    );
    
    fs.writeFileSync(testPath, testContent);
    console.log('✅ Updated test-sounds.html with new sounds');
  }
  
  generateSummary() {
    console.log('\n📊 SOUND ENHANCEMENT SUMMARY');
    console.log('=' .repeat(50));
    
    let totalSounds = 0;
    for (const [themeName, soundFiles] of Object.entries(NEW_SOUNDS)) {
      console.log(`🎵 ${themeName}: +${soundFiles.length} new sounds`);
      totalSounds += soundFiles.length;
    }
    
    console.log('=' .repeat(50));
    console.log(`✨ Total new sounds added: ${totalSounds}`);
    console.log('🎯 All themes now have enhanced variety!');
    console.log('🔊 Sound repetition fatigue eliminated');
    console.log('\n🧪 Test your new sounds:');
    console.log('   Open: /sounds/test-sounds.html');
  }
  
  run() {
    console.log('🚀 Updating sound system with new downloads...\n');
    
    this.updateManifests();
    this.updateSoundMappings();
    this.updateTestFile();
    this.generateSummary();
    
    console.log('\n✅ Sound system enhancement complete!');
  }
}

// Run the updater
if (require.main === module) {
  const updater = new SoundSystemUpdater();
  updater.run();
}

module.exports = SoundSystemUpdater;