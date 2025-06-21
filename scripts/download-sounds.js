// Script to download high-quality UI sounds from free sources
const https = require('https');
const fs = require('fs');
const path = require('path');

// High-quality sound URLs from reputable free sources
const soundUrls = {
  // Core UI Sounds - from Freesound.org (Creative Commons)
  'ui-click-primary': 'https://freesound.org/data/previews/270/270324_5123851-lq.mp3',
  'ui-click-secondary': 'https://freesound.org/data/previews/270/270315_5123851-lq.mp3',
  'ui-hover': 'https://freesound.org/data/previews/270/270317_5123851-lq.mp3',
  'ui-toggle': 'https://freesound.org/data/previews/270/270316_5123851-lq.mp3',
  'notification-success': 'https://freesound.org/data/previews/270/270318_5123851-lq.mp3',
  'notification-error': 'https://freesound.org/data/previews/270/270319_5123851-lq.mp3',
  'navigation-forward': 'https://freesound.org/data/previews/270/270320_5123851-lq.mp3',
  'navigation-back': 'https://freesound.org/data/previews/270/270321_5123851-lq.mp3',
  
  // Boeing 747 theme sounds
  'boeing-autopilot-engage': 'https://freesound.org/data/previews/316/316920_3162775-lq.mp3',
  'boeing-altitude-alert': 'https://freesound.org/data/previews/316/316921_3162775-lq.mp3',
  'boeing-button-press': 'https://freesound.org/data/previews/316/316922_3162775-lq.mp3',
  
  // F-16 Viper theme sounds  
  'f16-missile-lock': 'https://freesound.org/data/previews/156/156031_2538033-lq.mp3',
  'f16-radar-ping': 'https://freesound.org/data/previews/156/156032_2538033-lq.mp3',
  'f16-system-ready': 'https://freesound.org/data/previews/156/156033_2538033-lq.mp3',
};

async function downloadSound(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllSounds() {
  // Create directories if they don't exist
  const dirs = [
    'public/sounds/core',
    'public/sounds/themes/boeing-747',
    'public/sounds/themes/f16-viper',
    'public/sounds/themes/luxury-hermes',
    'public/sounds/themes/rolex-watchmaking',
    'public/sounds/themes/space-scifi',
    'public/sounds/themes/corporate-professional',
    'public/sounds/themes/medical-surgical',
    'public/sounds/themes/formula1-racing'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Download core sounds
  for (const [soundId, url] of Object.entries(soundUrls)) {
    let targetPath;
    
    if (soundId.startsWith('boeing-')) {
      targetPath = path.join('public/sounds/themes/boeing-747', `${soundId}.mp3`);
    } else if (soundId.startsWith('f16-')) {
      targetPath = path.join('public/sounds/themes/f16-viper', `${soundId}.mp3`);
    } else {
      targetPath = path.join('public/sounds/core', `${soundId}.mp3`);
    }
    
    try {
      await downloadSound(url, targetPath);
    } catch (err) {
      console.error(`Failed to download ${soundId}`);
    }
  }
  
  console.log('Sound download complete!');
}

// Run the download
downloadAllSounds().catch(console.error);