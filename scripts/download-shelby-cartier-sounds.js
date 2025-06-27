#!/usr/bin/env node

/**
 * Shelby GT500 Cartier Vintage Switchboard Theme Sound Downloader
 * Downloads real sounds from Freesound.org API specifically for this theme
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Freesound API Configuration
const FREESOUND_API_BASE = 'https://freesound.org/apiv2';
const CLIENT_ID = 'upfQ4yuxVID9g9AUwDhx';
const API_TOKEN = 'VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';

// Shelby GT500 Cartier Theme Search Queries
const SHELBY_CARTIER_QUERIES = {
  // Classic American Muscle Sounds
  'shelby-engine-roar': ['shelby engine', 'v8 engine roar', 'muscle car engine', 'american v8', 'cobra engine'],
  'manual-gear-shift': ['manual transmission', 'gear shift click', 'stick shift', 'clutch gear', 'transmission click'],
  'cobra-exhaust': ['muscle car exhaust', 'v8 exhaust', 'car exhaust loud', 'american muscle exhaust', 'engine exhaust'],
  'racing-tires': ['tire screech', 'racing tires', 'car tires', 'tire squeal', 'rubber tire'],
  'acceleration-burst': ['car acceleration', 'engine rev up', 'throttle acceleration', 'car speed up', 'engine power'],
  'tire-burnout': ['tire burnout', 'car burnout', 'tire spinning', 'rubber burning', 'wheel spin'],
  'classic-american': ['classic car', 'vintage automobile', 'american car', 'muscle car idle', 'retro car'],
  'automotive-heritage': ['vintage car sound', 'classic automobile', 'heritage car', 'antique car', 'old car engine'],

  // Swiss Luxury Precision Sounds  
  'cartier-precision': ['luxury watch', 'timepiece mechanism', 'precision clock', 'luxury timepiece', 'fine watch'],
  'mechanical-movement': ['watch mechanism', 'clock movement', 'mechanical watch', 'timepiece gears', 'precision mechanism'],
  'swiss-precision': ['swiss watch', 'precision engineering', 'mechanical precision', 'luxury mechanism', 'fine clockwork'],
  'vintage-luxury-blend': ['luxury vintage', 'elegant mechanism', 'refined machinery', 'premium vintage', 'luxury heritage'],

  // Vintage Telephony Sounds
  'vintage-switchboard': ['telephone switchboard', 'old switchboard', 'vintage telephone', 'phone operator', 'telephone exchange'],
  'telephone-operator': ['phone operator', 'telephone operator', 'switchboard operator', 'vintage phone call', 'old telephone'],
  'rotary-dial': ['rotary phone', 'dial telephone', 'rotary dial', 'vintage phone dial', 'old phone dial'],

  // Heritage Integration
  'vintage-luxury': ['vintage luxury', 'elegant vintage', 'refined antique', 'luxury heritage', 'premium vintage']
};

// Utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(outputPath);
    
    client.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(outputPath);
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

function makeApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${FREESOUND_API_BASE}${endpoint}`;
    
    https.get(url, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function searchSounds(query, maxResults = 5) {
  try {
    const searchParams = new URLSearchParams({
      query: query,
      page_size: maxResults,
      filter: 'duration:[0.1 TO 8.0] AND type:(wav OR mp3)',
      sort: 'downloads_desc'
    });
    
    const endpoint = `/search/text/?${searchParams}`;
    const response = await makeApiRequest(endpoint);
    
    return response.results || [];
  } catch (error) {
    console.log(`⚠️  Search failed for "${query}": ${error.message}`);
    return [];
  }
}

async function downloadShelbyCartierSounds() {
  console.log('🏎️💎 SHELBY GT500 CARTIER VINTAGE SWITCHBOARD SOUND DOWNLOADER');
  console.log('🎯 Downloading real Freesound API audio for your theme');
  console.log('');
  
  const themeDir = 'public/sounds/themes/shelbygt500cartier';
  
  // Ensure theme directory exists
  fs.mkdirSync(themeDir, { recursive: true });
  
  let totalDownloaded = 0;
  
  for (const [soundName, searchQueries] of Object.entries(SHELBY_CARTIER_QUERIES)) {
    console.log(`🔊 Processing: ${soundName}`);
    
    let soundDownloaded = false;
    
    for (const query of searchQueries) {
      if (soundDownloaded) break;
      
      console.log(`  🔍 Searching: "${query}"`);
      
      try {
        const sounds = await searchSounds(query, 3);
        
        for (const sound of sounds) {
          if (soundDownloaded) break;
          
          try {
            // Get download URL
            const soundDetail = await makeApiRequest(`/sounds/${sound.id}/`);
            
            let downloadUrl = null;
            
            // Try different preview formats
            if (soundDetail.previews) {
              downloadUrl = soundDetail.previews['preview-hq-mp3'] || 
                           soundDetail.previews['preview-lq-mp3'] || 
                           soundDetail.previews['preview-hq-ogg'];
            }
            
            if (downloadUrl) {
              const fileName = `${soundName}.mp3`;
              const outputPath = path.join(themeDir, fileName);
              
              console.log(`    ⬇️  Downloading: ${sound.name}`);
              
              await downloadFile(downloadUrl, outputPath);
              
              // Verify file was downloaded and has content
              if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 1000) { // At least 1KB
                  console.log(`    ✅ Success: ${fileName} (${Math.round(stats.size/1024)}KB)`);
                  soundDownloaded = true;
                  totalDownloaded++;
                } else {
                  fs.unlinkSync(outputPath);
                  console.log(`    ⚠️  File too small, removed: ${fileName}`);
                }
              }
              
              // Rate limiting
              await delay(1000);
            }
          } catch (downloadError) {
            console.log(`    ❌ Download failed: ${sound.name} - ${downloadError.message}`);
          }
        }
        
        await delay(500);
        
      } catch (searchError) {
        console.log(`    ❌ Search failed: "${query}" - ${searchError.message}`);
      }
    }
    
    if (!soundDownloaded) {
      console.log(`    ⚠️  No suitable sound found for ${soundName}`);
    }
  }
  
  console.log('');
  console.log('🎉 SHELBY GT500 CARTIER SOUNDS DOWNLOAD COMPLETE!');
  console.log(`📈 Total: ${totalDownloaded} real sounds downloaded`);
  console.log('🔊 Your "sound not found" issue should now be FIXED!');
  console.log('');
  console.log('🎯 Files downloaded to: public/sounds/themes/shelbygt500cartier/');
  
  return totalDownloaded;
}

// Run the script
if (require.main === module) {
  downloadShelbyCartierSounds().catch(console.error);
}

module.exports = { downloadShelbyCartierSounds };
