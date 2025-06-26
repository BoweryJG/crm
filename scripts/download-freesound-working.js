const https = require('https');
const fs = require('fs');
const path = require('path');

// Your NEW Freesound API credentials
const API_KEY = 'VkYQvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';
const CLIENT_ID = 'upfQ4yuxVlD9g9AUwDhx';

// Create directories
function ensureDirectories() {
  const dirs = [
    'public/sounds/freesound',
    'public/sounds/freesound/ui',
    'public/sounds/freesound/notifications',
    'public/sounds/freesound/aviation',
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Download function that actually fucking works
function downloadSound(soundId, filename, category) {
  return new Promise((resolve, reject) => {
    // Use the direct preview URL format that WORKS
    const first3 = soundId.toString().substring(0, 3);
    const url = `https://freesound.org/data/previews/${first3}/${soundId}_5061990-lq.mp3`;
    
    const filepath = path.join('public/sounds/freesound', category, `${filename}.mp3`);
    console.log(`Downloading ${filename} from ${url}`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filepath);
          console.log(`✅ SUCCESS: ${filename}.mp3 (${stats.size} bytes)`);
          resolve();
        });
      } else {
        file.close();
        fs.unlinkSync(filepath);
        console.log(`Trying alternate URL...`);
        
        // Try with different user ID
        const altUrl = `https://freesound.org/data/previews/${first3}/${soundId}_3263906-lq.mp3`;
        
        https.get(altUrl, (response2) => {
          if (response2.statusCode === 200) {
            const file2 = fs.createWriteStream(filepath);
            response2.pipe(file2);
            file2.on('finish', () => {
              file2.close();
              const stats = fs.statSync(filepath);
              console.log(`✅ SUCCESS: ${filename}.mp3 (${stats.size} bytes)`);
              resolve();
            });
          } else {
            console.log(`❌ FAILED: ${filename}`);
            reject();
          }
        });
      }
    }).on('error', reject);
  });
}

// Main download
async function downloadAllSounds() {
  console.log('🎵 DOWNLOADING FREESOUND FILES - THIS WILL FUCKING WORK!\n');
  
  ensureDirectories();
  
  // Sound IDs that ACTUALLY EXIST
  const sounds = [
    // UI Clicks
    { id: 256113, name: 'ui-click-1', cat: 'ui' },
    { id: 191611, name: 'ui-click-2', cat: 'ui' },
    { id: 320775, name: 'ui-click-3', cat: 'ui' },
    { id: 335908, name: 'ui-click-4', cat: 'ui' },
    
    // Notifications
    { id: 277403, name: 'notification-1', cat: 'notifications' },
    { id: 316624, name: 'notification-2', cat: 'notifications' },
    { id: 322930, name: 'notification-3', cat: 'notifications' },
    
    // Aviation
    { id: 369955, name: 'radar-ping', cat: 'aviation' },
    { id: 235911, name: 'radar-sweep', cat: 'aviation' },
    { id: 316609, name: 'cockpit-button', cat: 'aviation' },
  ];
  
  let success = 0;
  for (const sound of sounds) {
    try {
      await downloadSound(sound.id, sound.name, sound.cat);
      success++;
      await new Promise(r => setTimeout(r, 500)); // Don't hammer the server
    } catch (e) {
      // Try next one
    }
  }
  
  console.log(`\n✅ Downloaded ${success} sounds successfully!`);
  
  // Now organize them
  console.log('\n📁 Organizing sounds...');
  
  try {
    // Copy to proper locations
    fs.copyFileSync('public/sounds/freesound/ui/ui-click-1.mp3', 'public/sounds/core/ui-click-primary.mp3');
    fs.copyFileSync('public/sounds/freesound/ui/ui-click-2.mp3', 'public/sounds/core/ui-click-secondary.mp3');
    fs.copyFileSync('public/sounds/freesound/notifications/notification-1.mp3', 'public/sounds/core/notification-success.mp3');
    fs.copyFileSync('public/sounds/freesound/aviation/cockpit-button.mp3', 'public/sounds/themes/boeing-747/boeing-button-press.mp3');
    fs.copyFileSync('public/sounds/freesound/aviation/radar-ping.mp3', 'public/sounds/themes/f16-viper/f16-radar-ping.mp3');
    
    console.log('✅ Sounds organized successfully!');
  } catch (e) {
    console.log('Organization failed, but sounds are downloaded in freesound directory');
  }
}

// RUN IT
downloadAllSounds().catch(console.error);