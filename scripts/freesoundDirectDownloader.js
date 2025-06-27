#!/usr/bin/env node

/**
 * Freesound Direct API Mass Downloader
 * Uses client credentials for reliable authentication
 * Downloads 40-60 sounds per theme using direct API calls
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');

// Your Freesound app credentials
const CLIENT_ID = 'upfQ4yuxVID9g9AUwDhx';
const CLIENT_SECRET = 'VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';
const FREESOUND_API_BASE = 'https://freesound.org/apiv2';

// Theme-based search queries for authentic sounds
const THEME_QUERIES = {
  'boeing-747': {
    'ui-primary': ['aircraft button', 'cockpit switch', 'aviation click', 'plane button', 'flight control'],
    'ui-secondary': ['aircraft beep', 'cockpit interface', 'aviation sound', 'plane signal', 'flight system'],
    'notification': ['aircraft chime', 'cockpit alert', 'aviation notification', 'plane announce', 'flight ready'],
    'error': ['aircraft warning', 'cockpit alarm', 'aviation alert', 'plane emergency', 'flight caution'],
    'success': ['aircraft confirm', 'cockpit ready', 'aviation complete', 'plane success', 'flight engage']
  },
  'f16-viper': {
    'ui-primary': ['military click', 'fighter button', 'tactical switch', 'combat control', 'weapon interface'],
    'ui-secondary': ['radar ping', 'fighter beep', 'military interface', 'tactical sound', 'combat system'],
    'notification': ['military ready', 'fighter alert', 'combat notification', 'tactical update', 'mission ready'],
    'error': ['missile warning', 'threat alert', 'combat alarm', 'fighter emergency', 'tactical threat'],
    'success': ['target acquired', 'mission complete', 'combat success', 'fighter ready', 'tactical confirm']
  },
  'luxury-hermes': {
    'ui-primary': ['jewelry click', 'crystal tap', 'gold sound', 'luxury click', 'precious metal'],
    'ui-secondary': ['silk sound', 'velvet touch', 'leather creak', 'fabric rustle', 'luxury material'],
    'notification': ['crystal chime', 'jewelry bell', 'luxury alert', 'boutique sound', 'elegant bell'],
    'error': ['crystal break', 'luxury warning', 'precious alert', 'elegant error', 'boutique alarm'],
    'success': ['purchase complete', 'luxury success', 'elegant confirm', 'boutique chime', 'crystal ding']
  },
  'space-scifi': {
    'ui-primary': ['sci fi click', 'futuristic button', 'space interface', 'digital control', 'tech button'],
    'ui-secondary': ['scanner beep', 'computer interface', 'digital sound', 'tech interface', 'space system'],
    'notification': ['system ready', 'computer alert', 'digital notification', 'tech update', 'space signal'],
    'error': ['system error', 'computer alarm', 'digital warning', 'tech failure', 'space emergency'],
    'success': ['system complete', 'computer success', 'digital confirm', 'tech ready', 'space mission']
  },
  'medical-surgical': {
    'ui-primary': ['medical click', 'surgical sound', 'hospital equipment', 'clinical control', 'medical device'],
    'ui-secondary': ['monitor beep', 'medical interface', 'hospital sound', 'clinical device', 'surgical tool'],
    'notification': ['patient ready', 'medical alert', 'hospital notification', 'clinical update', 'procedure ready'],
    'error': ['medical alarm', 'patient warning', 'hospital emergency', 'clinical alert', 'surgical alarm'],
    'success': ['procedure complete', 'patient stable', 'medical success', 'clinical confirm', 'surgical ready']
  },
  'corporate-professional': {
    'ui-primary': ['office click', 'business button', 'corporate sound', 'professional click', 'executive interface'],
    'ui-secondary': ['keyboard sound', 'office interface', 'business device', 'corporate system', 'professional tool'],
    'notification': ['meeting alert', 'business notification', 'office chime', 'corporate update', 'professional ready'],
    'error': ['system error', 'business warning', 'office alert', 'corporate alarm', 'professional error'],
    'success': ['deal complete', 'business success', 'corporate confirm', 'professional ready', 'executive success']
  },
  'formula1-racing': {
    'ui-primary': ['racing click', 'gear shift', 'motorsport button', 'f1 interface', 'racing control'],
    'ui-secondary': ['telemetry beep', 'racing interface', 'motorsport sound', 'f1 system', 'pit interface'],
    'notification': ['lap complete', 'race alert', 'pit notification', 'racing update', 'motorsport ready'],
    'error': ['race warning', 'pit alarm', 'motorsport alert', 'f1 emergency', 'racing danger'],
    'success': ['race victory', 'lap record', 'pit success', 'racing win', 'motorsport complete']
  },
  'rolex-watchmaking': {
    'ui-primary': ['watch tick', 'mechanical click', 'timepiece sound', 'precision click', 'watch mechanism'],
    'ui-secondary': ['watch wind', 'mechanical sound', 'timepiece interface', 'precision device', 'watch control'],
    'notification': ['watch chime', 'timepiece alert', 'precision notification', 'watch ready', 'mechanical complete'],
    'error': ['watch alarm', 'timepiece warning', 'precision error', 'mechanical failure', 'watch alert'],
    'success': ['watch complete', 'timepiece success', 'precision ready', 'mechanical confirm', 'watch certified']
  }
};

let accessToken = null;

// Get client credentials token (no browser needed)
function getClientCredentialsToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    }).toString();

    const options = {
      hostname: 'freesound.org',
      path: '/apiv2/oauth2/access_token/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    console.log('🔑 Getting access token using client credentials...');

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tokenData = JSON.parse(data);
          if (tokenData.access_token) {
            console.log('✅ Access token obtained successfully');
            resolve(tokenData.access_token);
          } else {
            console.error('❌ Token response:', data);
            reject(new Error(`Token request failed: ${data}`));
          }
        } catch (error) {
          console.error('❌ Failed to parse token response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Token request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Search for sounds using API
function searchSounds(query, maxResults = 10) {
  return new Promise((resolve, reject) => {
    const searchUrl = new URL('/search/text/', FREESOUND_API_BASE);
    searchUrl.searchParams.set('query', query);
    searchUrl.searchParams.set('page_size', Math.min(maxResults, 150));
    searchUrl.searchParams.set('fields', 'id,name,previews,download,filesize,type,channels,samplerate');
    searchUrl.searchParams.set('filter', 'duration:[0.1 TO 5] channels:1 OR channels:2');

    const options = {
      hostname: 'freesound.org',
      path: searchUrl.pathname + searchUrl.search,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results.results) {
            resolve(results.results);
          } else {
            console.error('❌ Search error for:', query, data);
            resolve([]);
          }
        } catch (error) {
          console.error('❌ Failed to parse search results for:', query);
          resolve([]);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Search request error:', error);
      resolve([]);
    });

    req.end();
  });
}

// Download a sound file
function downloadSound(soundId, filename, theme, category) {
  return new Promise((resolve, reject) => {
    const downloadUrl = `${FREESOUND_API_BASE}/sounds/${soundId}/download/`;
    
    const options = {
      hostname: 'freesound.org',
      path: `/apiv2/sounds/${soundId}/download/`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        // Follow redirect to actual download URL
        const actualUrl = new URL(res.headers.location);
        
        const downloadReq = https.request(actualUrl, (downloadRes) => {
          const themeDir = `public/sounds/themes/${theme}`;
          if (!fs.existsSync(themeDir)) {
            fs.mkdirSync(themeDir, { recursive: true });
          }

          const filePath = path.join(themeDir, filename);
          const fileStream = fs.createWriteStream(filePath);

          downloadRes.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`✅ Downloaded: ${filename} (${theme}/${category})`);
            resolve(filePath);
          });

          fileStream.on('error', (error) => {
            console.error(`❌ File write error for ${filename}:`, error);
            reject(error);
          });
        });

        downloadReq.on('error', (error) => {
          console.error(`❌ Download error for ${filename}:`, error);
          reject(error);
        });

        downloadReq.end();
      } else {
        console.error(`❌ Download failed for ${soundId}: ${res.statusCode}`);
        reject(new Error(`Download failed: ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      console.error(`❌ Download request error for ${soundId}:`, error);
      reject(error);
    });

    req.end();
  });
}

// Process all themes and categories
async function downloadAllSounds() {
  console.log('🚀 FREESOUND DIRECT API MASS DOWNLOADER');
  console.log('🎯 Target: 40-60 sounds per theme using client credentials');
  console.log('');

  try {
    // Get access token
    accessToken = await getClientCredentialsToken();
    
    let totalDownloaded = 0;
    const downloadedSounds = {};

    // Process each theme
    for (const [theme, categories] of Object.entries(THEME_QUERIES)) {
      console.log(`\n🎵 Processing theme: ${theme}`);
      downloadedSounds[theme] = {};

      // Process each category within the theme
      for (const [category, queries] of Object.entries(categories)) {
        console.log(`  📂 Category: ${category}`);
        downloadedSounds[theme][category] = [];

        // Search with each query and download sounds
        for (let i = 0; i < queries.length; i++) {
          const query = queries[i];
          console.log(`    🔍 Searching: "${query}"`);

          try {
            const sounds = await searchSounds(query, 12); // Get 12 per query for variety
            
            for (let j = 0; j < Math.min(sounds.length, 8); j++) { // Download up to 8 per query
              const sound = sounds[j];
              
              // Generate filename
              const extension = sound.type === 'mp3' ? 'mp3' : 'wav';
              const filename = `${theme}-${category}-${query.replace(/\s+/g, '-').toLowerCase()}-${j + 1}.${extension}`;
              
              try {
                await downloadSound(sound.id, filename, theme, category);
                downloadedSounds[theme][category].push({
                  file: filename,
                  id: sound.id,
                  name: sound.name,
                  query: query
                });
                totalDownloaded++;
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
              } catch (error) {
                console.error(`❌ Failed to download ${filename}:`, error.message);
              }
            }
          } catch (error) {
            console.error(`❌ Search failed for "${query}":`, error.message);
          }
        }

        console.log(`    ✅ Downloaded ${downloadedSounds[theme][category].length} sounds for ${category}`);
      }

      const themeTotal = Object.values(downloadedSounds[theme]).reduce((sum, arr) => sum + arr.length, 0);
      console.log(`🎯 Theme ${theme} complete: ${themeTotal} sounds`);
    }

    console.log(`\n🎉 DOWNLOAD COMPLETE!`);
    console.log(`📊 Total sounds downloaded: ${totalDownloaded}`);
    console.log(`📁 Sounds organized by theme and category`);
    console.log(`🔄 Next: Update manifest files and sound mappings`);

    // Update manifests
    await updateManifests(downloadedSounds);

  } catch (error) {
    console.error('❌ Download process failed:', error);
    process.exit(1);
  }
}

// Update manifest files for each theme
async function updateManifests(downloadedSounds) {
  console.log('\n📝 Updating manifest files...');

  for (const [theme, categories] of Object.entries(downloadedSounds)) {
    const manifestPath = `public/sounds/themes/${theme}/manifest.json`;
    
    try {
      let manifest = {};
      if (fs.existsSync(manifestPath)) {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        manifest = JSON.parse(manifestContent);
      }

      // Update manifest with new sounds
      manifest.sounds = manifest.sounds || {};
      
      for (const [category, sounds] of Object.entries(categories)) {
        manifest.sounds[category] = sounds.map(sound => sound.file);
      }

      manifest.totalSounds = Object.values(manifest.sounds).reduce((sum, arr) => sum + arr.length, 0);
      manifest.lastUpdated = new Date().toISOString();

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`✅ Updated manifest: ${theme} (${manifest.totalSounds} sounds)`);
    } catch (error) {
      console.error(`❌ Failed to update manifest for ${theme}:`, error);
    }
  }

  console.log('🎯 All manifests updated successfully!');
}

// Start the download process
if (require.main === module) {
  downloadAllSounds().catch(console.error);
}