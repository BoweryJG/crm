// Script to download high-quality UI sounds from Pixabay (CC0/Public Domain)
const https = require('https');
const fs = require('fs');
const path = require('path');

// High-quality sound URLs from Pixabay - CC0 License (no attribution required)
const soundUrls = {
  // Core UI Sounds
  'ui-click-primary': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
  'ui-click-secondary': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3',
  'ui-hover': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8323d19d56.mp3',
  'ui-toggle': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3',
  'notification-success': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625880b61.mp3',
  'notification-error': 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c7d73467.mp3',
  'navigation-forward': 'https://cdn.pixabay.com/download/audio/2023/03/21/audio_d7fe0b73a2.mp3',
  'navigation-back': 'https://cdn.pixabay.com/download/audio/2023/03/21/audio_b8fe0c73a2.mp3',
};

async function downloadSound(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${filename} from ${url}`);
    
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Following redirect for ${filename}`);
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          
          file.on('finish', () => {
            file.close();
            const stats = fs.statSync(filename);
            console.log(`Downloaded: ${filename} (${stats.size} bytes)`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(filename, () => {});
          console.error(`Error downloading ${filename}:`, err.message);
          reject(err);
        });
      } else {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filename);
          console.log(`Downloaded: ${filename} (${stats.size} bytes)`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllSounds() {
  // Clean up existing files
  const coreDir = 'public/sounds/core';
  
  // Delete existing MP3 files that are actually HTML
  const files = fs.readdirSync(coreDir);
  files.forEach(file => {
    if (file.endsWith('.mp3')) {
      const filePath = path.join(coreDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('<') || content.includes('html')) {
        console.log(`Deleting invalid MP3 file: ${file}`);
        fs.unlinkSync(filePath);
      }
    }
  });
  
  // Download core sounds
  for (const [soundId, url] of Object.entries(soundUrls)) {
    const targetPath = path.join(coreDir, `${soundId}.mp3`);
    
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