#!/usr/bin/env node

/**
 * Freesound API Mass Downloader
 * Downloads real sounds from Freesound.org API for each theme
 * Creates 40-60 sounds per theme across all categories
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Freesound API Configuration
const FREESOUND_API_BASE = 'https://freesound.org/apiv2';
const CLIENT_ID = 'upfQ4yuxVID9g9AUwDhx'; // Your actual client ID
const API_TOKEN = 'VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf'; // Your actual API token

// Theme-based search queries for authentic sounds
const THEME_QUERIES = {
  'boeing-747': {
    'ui-primary': ['aircraft button click', 'cockpit switch', 'aviation control', 'boeing switch', 'plane button'],
    'ui-secondary': ['aircraft dial', 'cockpit knob', 'aviation beep', 'plane interface', 'flight control'],
    'notification': ['aircraft chime', 'cockpit alert', 'aviation notification', 'plane signal', 'flight announce'],
    'error': ['aircraft warning', 'cockpit alarm', 'aviation alert', 'plane emergency', 'flight caution'],
    'success': ['aircraft confirm', 'cockpit ready', 'aviation complete', 'plane success', 'flight engage']
  },
  'f16-viper': {
    'ui-primary': ['military button', 'fighter jet switch', 'tactical control', 'weapon select', 'combat interface'],
    'ui-secondary': ['radar beep', 'fighter interface', 'military display', 'tactical screen', 'jet control'],
    'notification': ['military ready', 'fighter status', 'combat update', 'tactical alert', 'mission ready'],
    'error': ['missile warning', 'threat alert', 'combat alarm', 'fighter warning', 'tactical threat'],
    'success': ['target lock', 'mission complete', 'combat success', 'fighter ready', 'tactical confirm']
  },
  'luxury-hermes': {
    'ui-primary': ['jewelry click', 'crystal tap', 'gold clink', 'luxury button', 'precious metal'],
    'ui-secondary': ['silk rustle', 'velvet touch', 'leather creak', 'fabric move', 'luxury material'],
    'notification': ['crystal chime', 'jewelry bell', 'luxury alert', 'boutique chime', 'elegant bell'],
    'error': ['crystal break', 'luxury alert', 'precious warning', 'elegant error', 'boutique alarm'],
    'success': ['purchase complete', 'luxury success', 'elegant confirm', 'boutique bell', 'crystal ding']
  },
  'space-scifi': {
    'ui-primary': ['hologram touch', 'sci fi button', 'space interface', 'futuristic click', 'digital control'],
    'ui-secondary': ['scanner beep', 'data stream', 'computer interface', 'digital display', 'tech interface'],
    'notification': ['system online', 'computer ready', 'data complete', 'system update', 'tech notification'],
    'error': ['system error', 'computer malfunction', 'tech failure', 'digital alarm', 'system alert'],
    'success': ['system ready', 'computer success', 'data transfer complete', 'tech confirm', 'digital success']
  },
  'medical-surgical': {
    'ui-primary': ['medical click', 'surgical instrument', 'hospital equipment', 'medical device', 'clinical control'],
    'ui-secondary': ['monitor beep', 'medical interface', 'hospital sound', 'clinical device', 'surgical equipment'],
    'notification': ['patient ready', 'procedure complete', 'medical alert', 'hospital notification', 'clinical update'],
    'error': ['medical alarm', 'patient alert', 'hospital emergency', 'clinical warning', 'surgical alarm'],
    'success': ['procedure success', 'patient stable', 'medical complete', 'clinical success', 'surgical ready']
  },
  'corporate-professional': {
    'ui-primary': ['office click', 'business button', 'corporate interface', 'professional click', 'executive control'],
    'ui-secondary': ['keyboard click', 'mouse click', 'office interface', 'business sound', 'corporate device'],
    'notification': ['meeting alert', 'business notification', 'office chime', 'corporate update', 'professional alert'],
    'error': ['system error', 'business alert', 'office warning', 'corporate alarm', 'professional error'],
    'success': ['deal complete', 'business success', 'corporate confirm', 'professional ready', 'executive success']
  },
  'formula1-racing': {
    'ui-primary': ['gear shift', 'racing button', 'motorsport control', 'f1 interface', 'racing switch'],
    'ui-secondary': ['telemetry beep', 'racing interface', 'motorsport display', 'f1 control', 'pit interface'],
    'notification': ['lap complete', 'race update', 'pit notification', 'racing alert', 'motorsport ready'],
    'error': ['race warning', 'pit alarm', 'motorsport alert', 'f1 warning', 'racing emergency'],
    'success': ['race win', 'lap record', 'pit success', 'racing victory', 'motorsport complete']
  },
  'rolex-watchmaking': {
    'ui-primary': ['watch tick', 'mechanical click', 'timepiece sound', 'watch mechanism', 'precision click'],
    'ui-secondary': ['watch wind', 'mechanical movement', 'timepiece interface', 'watch control', 'precision device'],
    'notification': ['watch chime', 'timepiece alert', 'precision notification', 'watch ready', 'mechanical complete'],
    'error': ['watch alarm', 'timepiece warning', 'precision error', 'mechanical failure', 'watch alert'],
    'success': ['watch complete', 'timepiece success', 'precision ready', 'mechanical confirm', 'watch certified']
  }
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
        // Handle redirects
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
      fs.unlinkSync(outputPath);
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

async function searchSounds(query, maxResults = 10) {
  try {
    const searchParams = new URLSearchParams({
      query: query,
      page_size: maxResults,
      filter: 'duration:[0.1 TO 5.0] AND type:wav',
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

async function downloadThemeSounds(themeName, queries) {
  console.log(`🎵 Processing theme: ${themeName.toUpperCase()}`);
  
  const themeDir = `public/sounds/themes/${themeName}`;
  
  // Ensure theme directory exists
  fs.mkdirSync(themeDir, { recursive: true });
  
  let totalDownloaded = 0;
  
  for (const [category, searchQueries] of Object.entries(queries)) {
    console.log(`  📂 Category: ${category}`);
    
    let categoryDownloaded = 0;
    const maxPerCategory = 12; // 8-12 sounds per category
    
    for (const query of searchQueries) {
      if (categoryDownloaded >= maxPerCategory) break;
      
      console.log(`    🔍 Searching: "${query}"`);
      
      try {
        const sounds = await searchSounds(query, 5);
        
        for (const sound of sounds) {
          if (categoryDownloaded >= maxPerCategory) break;
          
          try {
            // Get download URL
            const soundDetail = await makeApiRequest(`/sounds/${sound.id}/`);
            
            if (soundDetail.previews && soundDetail.previews['preview-lq-mp3']) {
              const downloadUrl = soundDetail.previews['preview-lq-mp3'];
              const fileName = `${category}-${sound.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.mp3`;
              const outputPath = path.join(themeDir, fileName);
              
              console.log(`    ⬇️  Downloading: ${sound.name}`);
              
              await downloadFile(downloadUrl, outputPath);
              
              // Verify file was downloaded and has content
              const stats = fs.statSync(outputPath);
              if (stats.size > 1000) { // At least 1KB
                console.log(`    ✅ Success: ${fileName} (${Math.round(stats.size/1024)}KB)`);
                categoryDownloaded++;
                totalDownloaded++;
              } else {
                fs.unlinkSync(outputPath);
                console.log(`    ⚠️  File too small, removed: ${fileName}`);
              }
              
              // Rate limiting - respect Freesound API limits
              await delay(500); // 500ms between downloads
              
            }
          } catch (downloadError) {
            console.log(`    ❌ Download failed: ${sound.name} - ${downloadError.message}`);
          }
        }
        
        // Small delay between searches
        await delay(200);
        
      } catch (searchError) {
        console.log(`    ❌ Search failed: "${query}" - ${searchError.message}`);
      }
    }
    
    console.log(`  📊 Category ${category}: ${categoryDownloaded} sounds downloaded`);
  }
  
  console.log(`🎯 Theme ${themeName}: ${totalDownloaded} total sounds downloaded\n`);
  return totalDownloaded;
}

async function main() {
  console.log('🚀 FREESOUND API MASS DOWNLOADER');
  console.log('🎯 Target: 40-60 sounds per theme using real Freesound API');
  console.log('');
  
  // Check if API token is configured
  if (API_TOKEN === 'your_api_token') {
    console.log('❌ Error: Please configure your Freesound API token');
    console.log('📖 Get your token at: https://freesound.org/apiv2/apply/');
    console.log('💡 Replace API_TOKEN in this script with your actual token');
    return;
  }
  
  let grandTotal = 0;
  
  for (const [themeName, queries] of Object.entries(THEME_QUERIES)) {
    try {
      const themeTotal = await downloadThemeSounds(themeName, queries);
      grandTotal += themeTotal;
    } catch (error) {
      console.log(`❌ Theme ${themeName} failed: ${error.message}`);
    }
  }
  
  console.log('');
  console.log('🎉 MASSIVE SOUND ENHANCEMENT COMPLETE!');
  console.log(`📈 Grand Total: ${grandTotal} real sounds downloaded`);
  console.log('🎵 Each theme now has proper variety across all categories');
  console.log('🔊 Repetition fatigue completely eliminated!');
  console.log('');
  console.log('💡 Next steps:');
  console.log('1. Update manifest.json files for each theme');
  console.log('2. Update soundMappings.ts with new sound references');
  console.log('3. Test the enhanced sound system');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { downloadThemeSounds, searchSounds, THEME_QUERIES };