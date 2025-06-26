const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Your Freesound credentials
const CLIENT_ID = 'upfQ4yuxVlD9g9AUwDhx';
const API_KEY = 'VkYQvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';

console.log('🎵 FREESOUND DOWNLOADER WITH YOUR API KEY\n');
console.log('Client ID:', CLIENT_ID);
console.log('API Key:', API_KEY.substring(0, 20) + '...\n');

// First, let's search for sounds and download them
async function searchAndDownload() {
  const searches = [
    { query: 'ui click', filename: 'ui-click-1.mp3' },
    { query: 'button click', filename: 'ui-click-2.mp3' },
    { query: 'notification', filename: 'notification-1.mp3' },
    { query: 'success sound', filename: 'success-1.mp3' },
    { query: 'error beep', filename: 'error-1.mp3' },
    { query: 'hover sound', filename: 'hover-1.mp3' },
    { query: 'toggle switch', filename: 'toggle-1.mp3' },
    { query: 'radar ping', filename: 'radar-1.mp3' },
    { query: 'warning alert', filename: 'warning-1.mp3' },
  ];
  
  // Create directory
  if (!fs.existsSync('public/sounds/api')) {
    fs.mkdirSync('public/sounds/api', { recursive: true });
  }
  
  for (const item of searches) {
    console.log(`\n🔍 Searching for: "${item.query}"`);
    
    // Use curl with your API key
    const curlCmd = `curl -s "https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(item.query)}&token=${API_KEY}&fields=id,name,previews&page_size=1"`;
    
    exec(curlCmd, (error, stdout, stderr) => {
      if (!error) {
        try {
          const data = JSON.parse(stdout);
          if (data.results && data.results.length > 0) {
            const sound = data.results[0];
            console.log(`Found: ${sound.name} (ID: ${sound.id})`);
            
            // Download the preview
            const previewUrl = sound.previews['preview-hq-mp3'];
            const downloadCmd = `curl -L -o "public/sounds/api/${item.filename}" "${previewUrl}&token=${API_KEY}"`;
            
            exec(downloadCmd, (err, out, serr) => {
              if (!err) {
                console.log(`✅ Downloaded: ${item.filename}`);
              } else {
                console.log(`❌ Failed to download: ${item.filename}`);
              }
            });
          }
        } catch (e) {
          console.log('Parse error:', e.message);
        }
      } else {
        console.log('Request failed:', error.message);
      }
    });
    
    // Wait between requests
    await new Promise(r => setTimeout(r, 2000));
  }
}

// Run it
searchAndDownload();