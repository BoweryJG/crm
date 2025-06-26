const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Download file from URL
const downloadFile = (url, destPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(destPath);
        console.log(`✅ Downloaded: ${path.basename(destPath)} (${stats.size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      console.error(`❌ Error downloading ${path.basename(destPath)}:`, err.message);
      reject(err);
    });
  });
};

// Clean up invalid sound files (HTML errors)
const cleanupInvalidFiles = () => {
  const dirs = [
    'public/sounds/core',
    'public/sounds/themes/boeing-747',
    'public/sounds/themes/f16-viper'
  ];
  
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        if (file.endsWith('.mp3') || file.endsWith('.wav')) {
          const filePath = path.join(dir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('<html') || content.includes('<!DOCTYPE')) {
              console.log(`🗑️  Deleting invalid file: ${filePath}`);
              fs.unlinkSync(filePath);
            }
          } catch (e) {
            // Binary file, likely valid
          }
        }
      });
    }
  });
};

async function downloadSoundsFromFreesound() {
  console.log('🎵 Starting sound download process...\n');
  
  // Setup directories
  ensureDirectoryExists('public/sounds/core');
  ensureDirectoryExists('public/sounds/themes/boeing-747');
  ensureDirectoryExists('public/sounds/themes/f16-viper');
  
  // Clean up invalid files first
  cleanupInvalidFiles();
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Sound mappings with Freesound IDs and Pixabay URLs as fallback
    const soundMappings = {
      // Core UI Sounds
      'ui-click-primary': [
        'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3',
        'https://freesound.org/data/previews/256/256113_3263906-lq.mp3'
      ],
      'ui-click-secondary': [
        'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3',
        'https://freesound.org/data/previews/191/191611_2437358-lq.mp3'
      ],
      'ui-hover': [
        'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8323d19d56.mp3',
        'https://freesound.org/data/previews/334/334239_5137451-lq.mp3'
      ],
      'ui-toggle': [
        'https://cdn.pixabay.com/download/audio/2021/08/09/audio_54ca0ffa52.mp3',
        'https://freesound.org/data/previews/351/351563_5665772-lq.mp3'
      ],
      'notification-success': [
        'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625880b61.mp3',
        'https://freesound.org/data/previews/277/277403_5061990-lq.mp3'
      ],
      'notification-error': [
        'https://cdn.pixabay.com/download/audio/2022/03/10/audio_72d9f6c7f7.mp3',
        'https://freesound.org/data/previews/171/171670_2437358-lq.mp3'
      ],
      'navigation-forward': [
        'https://cdn.pixabay.com/download/audio/2023/06/22/audio_c794faa20d.mp3',
        'https://freesound.org/data/previews/345/345978_5137451-lq.mp3'
      ],
      'navigation-back': [
        'https://cdn.pixabay.com/download/audio/2023/06/22/audio_2cc4a29173.mp3',
        'https://freesound.org/data/previews/345/345979_5137451-lq.mp3'
      ],
      'gauge-tick': [
        'https://freesound.org/data/previews/254/254316_4486188-lq.mp3',
        'https://cdn.pixabay.com/download/audio/2022/10/30/audio_1cd99f1310.mp3'
      ]
    };
    
    // Boeing 747 Theme Sounds
    const boeing747Sounds = {
      'boeing-button-press': [
        'https://freesound.org/data/previews/316/316609_52661-lq.mp3',
        'https://freesound.org/data/previews/219/219477_71257-lq.mp3'
      ],
      'boeing-autopilot-engage': [
        'https://freesound.org/data/previews/478/478965_6142149-lq.mp3',
        'https://freesound.org/data/previews/426/426888_7913959-lq.mp3'
      ],
      'boeing-altitude-alert': [
        'https://freesound.org/data/previews/457/457973_8386665-lq.mp3',
        'https://freesound.org/data/previews/399/399934_1661766-lq.mp3'
      ]
    };
    
    // F-16 Viper Theme Sounds  
    const f16Sounds = {
      'f16-radar-ping': [
        'https://freesound.org/data/previews/235/235911_2523779-lq.mp3',
        'https://freesound.org/data/previews/369/369955_6870638-lq.mp3'
      ],
      'f16-missile-lock': [
        'https://freesound.org/data/previews/242/242501_2304554-lq.mp3',
        'https://freesound.org/data/previews/249/249300_3756348-lq.mp3'
      ],
      'f16-system-ready': [
        'https://freesound.org/data/previews/275/275896_3544020-lq.mp3',
        'https://freesound.org/data/previews/320/320655_5260872-lq.mp3'
      ]
    };
    
    console.log('📥 Downloading Core UI Sounds...\n');
    for (const [soundName, urls] of Object.entries(soundMappings)) {
      const destPath = path.join('public/sounds/core', `${soundName}.mp3`);
      
      for (const url of urls) {
        try {
          await downloadFile(url, destPath);
          break; // Success, move to next sound
        } catch (e) {
          console.log(`⚠️  Failed to download ${soundName} from ${url}, trying next source...`);
        }
      }
    }
    
    console.log('\n✈️  Downloading Boeing 747 Theme Sounds...\n');
    for (const [soundName, urls] of Object.entries(boeing747Sounds)) {
      const destPath = path.join('public/sounds/themes/boeing-747', `${soundName}.mp3`);
      
      for (const url of urls) {
        try {
          await downloadFile(url, destPath);
          break;
        } catch (e) {
          console.log(`⚠️  Failed to download ${soundName} from ${url}, trying next source...`);
        }
      }
    }
    
    console.log('\n🚀 Downloading F-16 Viper Theme Sounds...\n');
    for (const [soundName, urls] of Object.entries(f16Sounds)) {
      const destPath = path.join('public/sounds/themes/f16-viper', `${soundName}.mp3`);
      
      for (const url of urls) {
        try {
          await downloadFile(url, destPath);
          break;
        } catch (e) {
          console.log(`⚠️  Failed to download ${soundName} from ${url}, trying next source...`);
        }
      }
    }
    
    console.log('\n✨ Download process complete!');
    
    // Also download some additional CRM-specific sounds
    console.log('\n📞 Downloading CRM-specific sounds...\n');
    
    const crmSounds = {
      'call-ringing': 'https://freesound.org/data/previews/316/316808_5123451-lq.mp3',
      'call-connected': 'https://freesound.org/data/previews/263/263133_3544020-lq.mp3',
      'call-ended': 'https://freesound.org/data/previews/394/394903_1676145-lq.mp3',
      'message-sent': 'https://freesound.org/data/previews/234/234524_4019029-lq.mp3',
      'message-received': 'https://freesound.org/data/previews/381/381353_6891162-lq.mp3',
      'save-success': 'https://freesound.org/data/previews/362/362204_6103172-lq.mp3',
      'task-complete': 'https://freesound.org/data/previews/256/256116_3263906-lq.mp3'
    };
    
    for (const [soundName, url] of Object.entries(crmSounds)) {
      const destPath = path.join('public/sounds/core', `${soundName}.mp3`);
      try {
        await downloadFile(url, destPath);
      } catch (e) {
        console.log(`⚠️  Failed to download ${soundName}`);
      }
    }
    
  } catch (error) {
    console.error('Error during download process:', error);
  } finally {
    await browser.close();
    console.log('\n🎉 All done! Sound files have been downloaded.');
  }
}

// Run the download
downloadSoundsFromFreesound().catch(console.error);