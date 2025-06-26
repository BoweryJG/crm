const https = require('https');
const fs = require('fs');
const path = require('path');

// Your Freesound API credentials
const API_KEY = 'upfQ4yuxVID9g9AUwDhxVkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';
const CLIENT_ID = 'vT2P4QX5AXDuMJLCYvLI';

// Sound collections with Freesound IDs
const SOUND_COLLECTIONS = {
  // UI Click Sounds
  uiClicks: [
    { id: 256113, name: 'ui-click-soft', query: 'ui click soft' },
    { id: 191611, name: 'ui-click-sharp', query: 'click sharp' },
    { id: 220173, name: 'ui-click-minimal', query: 'minimal click' },
    { id: 244252, name: 'ui-click-tech', query: 'tech click beep' },
    { id: 320775, name: 'ui-click-bubble', query: 'bubble pop click' }
  ],
  
  // Hover Sounds
  hover: [
    { id: 334239, name: 'ui-hover-soft', query: 'hover soft' },
    { id: 266016, name: 'ui-hover-sweep', query: 'sweep hover' },
    { id: 242856, name: 'ui-hover-tone', query: 'hover tone' }
  ],
  
  // Toggle/Switch Sounds
  toggle: [
    { id: 351563, name: 'ui-toggle-on', query: 'toggle switch on' },
    { id: 321103, name: 'ui-toggle-switch', query: 'switch toggle' },
    { id: 344518, name: 'ui-toggle-click', query: 'toggle click' }
  ],
  
  // Notification Sounds
  notifications: [
    { id: 277403, name: 'notification-bell', query: 'notification bell' },
    { id: 316624, name: 'notification-chime', query: 'chime alert' },
    { id: 411090, name: 'notification-pop', query: 'pop notification' },
    { id: 345299, name: 'notification-ding', query: 'ding sound' },
    { id: 322930, name: 'notification-alert', query: 'alert sound' }
  ],
  
  // Success/Error Sounds
  feedback: [
    { id: 277403, name: 'success-chime', query: 'success chime' },
    { id: 398937, name: 'success-bell', query: 'success bell' },
    { id: 171670, name: 'error-buzz', query: 'error buzz' },
    { id: 142608, name: 'error-beep', query: 'error beep' }
  ],
  
  // Aviation/Military Sounds
  aviation: [
    { id: 369955, name: 'radar-ping', query: 'radar ping' },
    { id: 235911, name: 'radar-sweep', query: 'radar sweep' },
    { id: 242501, name: 'missile-lock', query: 'missile lock warning' },
    { id: 399934, name: 'altitude-warning', query: 'altitude warning' },
    { id: 316609, name: 'cockpit-button', query: 'cockpit button' },
    { id: 478965, name: 'autopilot-engage', query: 'autopilot engage' }
  ],
  
  // CRM-specific sounds
  crm: [
    { id: 316808, name: 'phone-ring', query: 'phone ring' },
    { id: 263133, name: 'call-connect', query: 'call connect' },
    { id: 394903, name: 'call-end', query: 'call end' },
    { id: 234524, name: 'message-send', query: 'message sent whoosh' },
    { id: 362204, name: 'save-success', query: 'save success' }
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

// Get sound info from Freesound API
function getSoundInfo(soundId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'freesound.org',
      path: `/apiv2/sounds/${soundId}/?token=${API_KEY}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const soundInfo = JSON.parse(data);
          resolve(soundInfo);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download sound file
function downloadSound(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Download a sound using the API
async function downloadFreesoundWithAPI(soundId, filename, category) {
  try {
    console.log(`🔍 Fetching info for sound ${soundId}...`);
    
    // Get sound info
    const soundInfo = await getSoundInfo(soundId);
    
    // Use high quality preview URL with API token
    const downloadUrl = `${soundInfo.previews['preview-hq-mp3']}&token=${API_KEY}`;
    const filepath = path.join('public/sounds/freesound', category, `${filename}.mp3`);
    
    console.log(`📥 Downloading: ${soundInfo.name} by ${soundInfo.username}`);
    console.log(`   Duration: ${soundInfo.duration.toFixed(1)}s, License: ${soundInfo.license}`);
    
    await downloadSound(downloadUrl, filepath);
    
    const stats = fs.statSync(filepath);
    console.log(`✅ Downloaded: ${filename}.mp3 (${(stats.size / 1024).toFixed(1)}KB)\n`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to download sound ${soundId}: ${error.message}\n`);
    return false;
  }
}

// Search for sounds if specific ID fails
async function searchAndDownload(query, filename, category) {
  try {
    console.log(`🔍 Searching for: ${query}`);
    
    const searchUrl = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&token=${API_KEY}&fields=id,name,username,duration,license,previews&page_size=5&sort=downloads_desc`;
    
    return new Promise((resolve, reject) => {
      https.get(searchUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', async () => {
          try {
            const results = JSON.parse(data);
            if (results.results && results.results.length > 0) {
              const sound = results.results[0];
              console.log(`   Found: "${sound.name}" by ${sound.username}`);
              
              const downloadUrl = `${sound.previews['preview-hq-mp3']}&token=${API_KEY}`;
              const filepath = path.join('public/sounds/freesound', category, `${filename}.mp3`);
              
              await downloadSound(downloadUrl, filepath);
              const stats = fs.statSync(filepath);
              console.log(`✅ Downloaded: ${filename}.mp3 (${(stats.size / 1024).toFixed(1)}KB)\n`);
              resolve(true);
            } else {
              console.log(`❌ No results found for: ${query}\n`);
              resolve(false);
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Search failed: ${error.message}\n`);
    return false;
  }
}

// Main download function
async function downloadAllSounds() {
  console.log('🎵 Starting Freesound API download process...');
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 10)}...`);
  console.log('');
  
  ensureDirectories();
  
  let successCount = 0;
  let failCount = 0;
  
  // Download each category
  for (const [category, sounds] of Object.entries(SOUND_COLLECTIONS)) {
    console.log(`\n📁 Downloading ${category} sounds...`);
    console.log('━'.repeat(50));
    
    for (const sound of sounds) {
      // Try downloading by ID first
      let success = await downloadFreesoundWithAPI(sound.id, sound.name, category);
      
      // If that fails, try searching
      if (!success && sound.query) {
        console.log(`   Trying search fallback...`);
        success = await searchAndDownload(sound.query, sound.name, category);
      }
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Rate limiting - be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log(`✨ Download complete!`);
  console.log(`✅ Successfully downloaded: ${successCount} sounds`);
  console.log(`❌ Failed downloads: ${failCount} sounds`);
  console.log('═'.repeat(50));
  
  // Create organization script
  createOrganizeScript();
}

// Create script to organize downloads
function createOrganizeScript() {
  const script = `#!/bin/bash
# Organize Freesound downloads into CRM directories

echo "🎵 Organizing Freesound downloads..."

# Core UI sounds
cp -f public/sounds/freesound/uiClicks/ui-click-soft.mp3 public/sounds/core/ui-click-primary.mp3 2>/dev/null
cp -f public/sounds/freesound/uiClicks/ui-click-sharp.mp3 public/sounds/core/ui-click-secondary.mp3 2>/dev/null
cp -f public/sounds/freesound/hover/ui-hover-soft.mp3 public/sounds/core/ui-hover.mp3 2>/dev/null
cp -f public/sounds/freesound/toggle/ui-toggle-on.mp3 public/sounds/core/ui-toggle.mp3 2>/dev/null

# Notifications
cp -f public/sounds/freesound/notifications/notification-chime.mp3 public/sounds/core/notification-success.mp3 2>/dev/null
cp -f public/sounds/freesound/feedback/error-buzz.mp3 public/sounds/core/notification-error.mp3 2>/dev/null

# Aviation theme
mkdir -p public/sounds/themes/boeing-747
cp -f public/sounds/freesound/aviation/cockpit-button.mp3 public/sounds/themes/boeing-747/boeing-button-press.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/autopilot-engage.mp3 public/sounds/themes/boeing-747/boeing-autopilot-engage.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/altitude-warning.mp3 public/sounds/themes/boeing-747/boeing-altitude-alert.mp3 2>/dev/null

mkdir -p public/sounds/themes/f16-viper
cp -f public/sounds/freesound/aviation/radar-ping.mp3 public/sounds/themes/f16-viper/f16-radar-ping.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/missile-lock.mp3 public/sounds/themes/f16-viper/f16-missile-lock.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/radar-sweep.mp3 public/sounds/themes/f16-viper/f16-system-ready.mp3 2>/dev/null

echo "✅ Sound organization complete!"
echo ""
echo "📁 Check these directories:"
echo "  - public/sounds/core/"
echo "  - public/sounds/themes/boeing-747/"
echo "  - public/sounds/themes/f16-viper/"
`;
  
  fs.writeFileSync('scripts/organize-freesound-api.sh', script);
  fs.chmodSync('scripts/organize-freesound-api.sh', '755');
  console.log('\n📝 Created organize-freesound-api.sh script');
  console.log('   Run: ./scripts/organize-freesound-api.sh');
}

// Run the download
downloadAllSounds().catch(console.error);