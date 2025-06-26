const https = require('https');
const fs = require('fs');
const path = require('path');

// Freesound requires an API key for downloading
// You can get a free API key at https://freesound.org/apiv2/apply/
// For now, we'll use direct preview URLs which don't require authentication

const SOUND_COLLECTIONS = {
  // UI Click Sounds - Various electronic and mechanical clicks
  uiClicks: [
    { id: '256113', name: 'ui-click-soft', description: 'Soft UI click' },
    { id: '191611', name: 'ui-click-sharp', description: 'Sharp click sound' },
    { id: '320775', name: 'ui-click-bubble', description: 'Bubble pop click' },
    { id: '242501', name: 'ui-click-tech', description: 'Technical beep click' },
    { id: '335908', name: 'ui-click-minimal', description: 'Minimal click' }
  ],
  
  // Hover Sounds - Subtle feedback
  hover: [
    { id: '334239', name: 'ui-hover-soft', description: 'Soft hover sound' },
    { id: '266016', name: 'ui-hover-sweep', description: 'Sweep hover effect' },
    { id: '325805', name: 'ui-hover-tone', description: 'Tone hover sound' }
  ],
  
  // Toggle/Switch Sounds
  toggle: [
    { id: '351563', name: 'ui-toggle-on', description: 'Toggle on sound' },
    { id: '321103', name: 'ui-toggle-switch', description: 'Switch toggle' },
    { id: '344518', name: 'ui-toggle-click', description: 'Click toggle' }
  ],
  
  // Notification Sounds
  notifications: [
    { id: '277403', name: 'notification-bell', description: 'Bell notification' },
    { id: '316624', name: 'notification-chime', description: 'Chime alert' },
    { id: '411090', name: 'notification-pop', description: 'Pop notification' },
    { id: '345299', name: 'notification-ding', description: 'Ding sound' },
    { id: '322930', name: 'notification-alert', description: 'Alert sound' }
  ],
  
  // Success/Error Sounds  
  feedback: [
    { id: '436117', name: 'success-chime', description: 'Success chime' },
    { id: '398937', name: 'success-bell', description: 'Success bell' },
    { id: '171670', name: 'error-buzz', description: 'Error buzz' },
    { id: '142608', name: 'error-beep', description: 'Error beep' },
    { id: '365634', name: 'complete-ding', description: 'Task complete' }
  ],
  
  // Aviation/Military Sounds for themes
  aviation: [
    { id: '369955', name: 'radar-ping', description: 'Radar ping sound' },
    { id: '242501', name: 'missile-lock', description: 'Missile lock warning' },
    { id: '399934', name: 'altitude-warning', description: 'Altitude warning' },
    { id: '478965', name: 'autopilot-engage', description: 'Autopilot sound' },
    { id: '235911', name: 'radar-sweep', description: 'Radar sweep' },
    { id: '316609', name: 'cockpit-button', description: 'Cockpit button press' }
  ],
  
  // CRM-specific sounds
  crm: [
    { id: '316808', name: 'phone-ring', description: 'Phone ringing' },
    { id: '263133', name: 'call-connect', description: 'Call connected' },
    { id: '394903', name: 'call-end', description: 'Call ended' },
    { id: '234524', name: 'message-send', description: 'Message sent' },
    { id: '381353', name: 'message-receive', description: 'Message received' },
    { id: '362204', name: 'save-success', description: 'Save success' },
    { id: '411088', name: 'data-sync', description: 'Data sync sound' }
  ]
};

// Create directories
function ensureDirectories() {
  const dirs = [
    'public/sounds/freesound',
    'public/sounds/freesound/ui',
    'public/sounds/freesound/notifications',
    'public/sounds/freesound/aviation',
    'public/sounds/freesound/crm'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Download a sound from Freesound preview URL
function downloadFreesound(soundId, filename, category) {
  return new Promise((resolve, reject) => {
    // Freesound preview URLs - these are freely accessible
    // Format: https://freesound.org/data/previews/[first-3-digits]/[id]_[userid]-lq.mp3
    const first3 = soundId.substring(0, 3);
    const url = `https://freesound.org/data/previews/${first3}/${soundId}_preview.mp3`;
    const altUrl = `https://freesound.org/data/previews/${first3}/${soundId}_preview.ogg`;
    
    const filepath = path.join('public/sounds/freesound', category, `${filename}.mp3`);
    
    console.log(`Downloading ${filename} from Freesound ID: ${soundId}`);
    
    const file = fs.createWriteStream(filepath);
    
    const tryDownload = (downloadUrl, isRetry = false) => {
      https.get(downloadUrl, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            const stats = fs.statSync(filepath);
            if (stats.size > 1000) { // Check if file is larger than 1KB
              console.log(`✅ Downloaded: ${filename} (${stats.size} bytes)`);
              resolve();
            } else {
              fs.unlinkSync(filepath);
              if (!isRetry) {
                console.log(`Retrying with alternate URL...`);
                tryDownload(altUrl, true);
              } else {
                console.log(`❌ Failed: ${filename} - File too small`);
                reject(new Error('File too small'));
              }
            }
          });
        } else if (!isRetry) {
          file.close();
          console.log(`Retrying with alternate URL...`);
          tryDownload(altUrl, true);
        } else {
          file.close();
          fs.unlinkSync(filepath);
          console.log(`❌ Failed: ${filename} - Status ${response.statusCode}`);
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', (err) => {
        file.close();
        fs.unlinkSync(filepath);
        console.error(`❌ Error downloading ${filename}:`, err.message);
        reject(err);
      });
    };
    
    tryDownload(url);
  });
}

// Download all sounds
async function downloadAllSounds() {
  console.log('🎵 Starting Freesound download process...\n');
  
  ensureDirectories();
  
  let successCount = 0;
  let failCount = 0;
  
  // Download each category
  for (const [category, sounds] of Object.entries(SOUND_COLLECTIONS)) {
    console.log(`\n📁 Downloading ${category} sounds...`);
    
    for (const sound of sounds) {
      try {
        await downloadFreesound(sound.id, sound.name, category);
        successCount++;
        // Add a small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        failCount++;
      }
    }
  }
  
  console.log(`\n✨ Download complete!`);
  console.log(`✅ Successfully downloaded: ${successCount} sounds`);
  console.log(`❌ Failed downloads: ${failCount} sounds`);
  
  // Create a script to copy the best sounds to the main directories
  createOrganizeScript();
}

// Create organization script
function createOrganizeScript() {
  const script = `#!/bin/bash
# Script to organize downloaded Freesound files into CRM sound directories

echo "🎵 Organizing Freesound downloads..."

# Core UI sounds
cp public/sounds/freesound/uiClicks/ui-click-soft.mp3 public/sounds/core/ui-click-primary.mp3 2>/dev/null
cp public/sounds/freesound/uiClicks/ui-click-sharp.mp3 public/sounds/core/ui-click-secondary.mp3 2>/dev/null
cp public/sounds/freesound/hover/ui-hover-soft.mp3 public/sounds/core/ui-hover.mp3 2>/dev/null
cp public/sounds/freesound/toggle/ui-toggle-on.mp3 public/sounds/core/ui-toggle.mp3 2>/dev/null

# Notifications
cp public/sounds/freesound/notifications/notification-chime.mp3 public/sounds/core/notification-success.mp3 2>/dev/null
cp public/sounds/freesound/feedback/error-buzz.mp3 public/sounds/core/notification-error.mp3 2>/dev/null

# Aviation theme sounds
cp public/sounds/freesound/aviation/cockpit-button.mp3 public/sounds/themes/boeing-747/boeing-button-press.mp3 2>/dev/null
cp public/sounds/freesound/aviation/autopilot-engage.mp3 public/sounds/themes/boeing-747/boeing-autopilot-engage.mp3 2>/dev/null
cp public/sounds/freesound/aviation/altitude-warning.mp3 public/sounds/themes/boeing-747/boeing-altitude-alert.mp3 2>/dev/null

cp public/sounds/freesound/aviation/radar-ping.mp3 public/sounds/themes/f16-viper/f16-radar-ping.mp3 2>/dev/null
cp public/sounds/freesound/aviation/missile-lock.mp3 public/sounds/themes/f16-viper/f16-missile-lock.mp3 2>/dev/null
cp public/sounds/freesound/aviation/radar-sweep.mp3 public/sounds/themes/f16-viper/f16-system-ready.mp3 2>/dev/null

echo "✅ Organization complete! Check public/sounds/core and theme directories."
`;
  
  fs.writeFileSync('scripts/organize-freesound.sh', script);
  fs.chmodSync('scripts/organize-freesound.sh', '755');
  console.log('\n📝 Created organize-freesound.sh script');
}

// Run the download
downloadAllSounds().catch(console.error);