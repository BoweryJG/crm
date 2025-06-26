const https = require('https');
const fs = require('fs');
const path = require('path');

// CORRECT API KEY
const API_KEY = 'VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';

// Ensure directory exists
if (!fs.existsSync('public/sounds/freesound-downloads')) {
  fs.mkdirSync('public/sounds/freesound-downloads', { recursive: true });
}

// Function to search and get sound info
function searchSound(query) {
  return new Promise((resolve, reject) => {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&token=${API_KEY}&fields=id,name,previews&page_size=1&filter=duration:[0.1 TO 5]`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            resolve(result.results[0]);
          } else {
            reject('No results');
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  });
}

// Function to download file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        if (stats.size > 10000) {
          resolve(stats.size);
        } else {
          fs.unlinkSync(dest);
          reject('File too small');
        }
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// Main download function
async function downloadSounds() {
  console.log('🎵 FREESOUND DOWNLOAD WITH WORKING API\n');
  
  const searches = [
    { query: 'click button ui', filename: 'ui-click' },
    { query: 'notification bell', filename: 'notification' },
    { query: 'success sound', filename: 'success' },
    { query: 'error beep', filename: 'error' },
    { query: 'hover sound ui', filename: 'hover' },
    { query: 'switch toggle', filename: 'toggle' },
    { query: 'radar ping', filename: 'radar' },
    { query: 'warning beep', filename: 'warning' }
  ];
  
  for (const item of searches) {
    try {
      console.log(`\n🔍 Searching for: ${item.query}`);
      const sound = await searchSound(item.query);
      console.log(`Found: ${sound.name} (ID: ${sound.id})`);
      
      // Try to download high quality preview
      if (sound.previews && sound.previews['preview-hq-mp3']) {
        const dest = path.join('public/sounds/freesound-downloads', `${item.filename}.mp3`);
        console.log('Downloading...');
        
        const size = await downloadFile(sound.previews['preview-hq-mp3'], dest);
        console.log(`✅ Downloaded: ${item.filename}.mp3 (${size} bytes)`);
      }
    } catch (e) {
      console.log(`❌ Failed: ${e}`);
    }
    
    // Wait between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n📁 Downloaded files:');
  const files = fs.readdirSync('public/sounds/freesound-downloads');
  files.forEach(f => {
    const stats = fs.statSync(path.join('public/sounds/freesound-downloads', f));
    console.log(`  ${f}: ${stats.size} bytes`);
  });
  
  // Copy to CRM locations
  console.log('\n🔧 Copying to CRM directories...');
  try {
    fs.copyFileSync('public/sounds/freesound-downloads/ui-click.mp3', 'public/sounds/core/ui-click-primary.mp3');
    fs.copyFileSync('public/sounds/freesound-downloads/notification.mp3', 'public/sounds/core/notification-success.mp3');
    fs.copyFileSync('public/sounds/freesound-downloads/error.mp3', 'public/sounds/core/notification-error.mp3');
    console.log('✅ Files copied to CRM directories');
  } catch (e) {
    console.log('Copy failed:', e.message);
  }
  
  console.log('\n✅ ALL DONE!');
}

// Run it
downloadSounds().catch(console.error);