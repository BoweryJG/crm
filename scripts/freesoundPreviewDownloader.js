#!/usr/bin/env node

/**
 * Freesound Preview Mass Downloader
 * Uses public search API and downloads preview files (no auth needed)
 * Downloads 40-60 sounds per theme using preview MP3s
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');

console.log('🚀 FREESOUND PREVIEW MASS DOWNLOADER');
console.log('🎯 Target: 40-60 sounds per theme using public preview files');

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

// Search for sounds using public API (no auth needed)
function searchSounds(query, page = 1) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Searching: "${query}" (page ${page})`);
    
    const queryParams = new URLSearchParams({
      query: query,
      page: page,
      page_size: 15,
      fields: 'id,name,previews,duration,license,username',
      format: 'json'
    });

    const options = {
      hostname: 'freesound.org',
      port: 443,
      path: `/apiv2/search/text/?${queryParams}`,
      method: 'GET',
      headers: {
        'User-Agent': 'CRM-SoundDownloader/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.results) {
            console.log(`✅ Found ${response.results.length} results`);
            resolve(response.results);
          } else {
            console.log('❌ Search response:', response);
            reject(new Error(`Search failed: ${data}`));
          }
        } catch (error) {
          console.log('❌ Search response:', data);
          reject(new Error(`Search failed: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Download preview file (no auth needed)
function downloadPreview(sound, themePath, category) {
  return new Promise((resolve, reject) => {
    // Use preview URL - these are public and don't require authentication
    const previewUrl = sound.previews?.['preview-lq-mp3'] || sound.previews?.['preview-hq-mp3'];
    if (!previewUrl) {
      console.log(`❌ No preview URL for: ${sound.name}`);
      resolve(null);
      return;
    }

    // Create a clean filename
    const cleanName = sound.name.replace(/[^a-zA-Z0-9\-_]/g, '-').toLowerCase().substring(0, 50);
    const filename = `${category}-${sound.id}-${cleanName}.mp3`;
    const filepath = path.join(themePath, filename);

    console.log(`⬇️  Downloading: ${filename}`);

    const urlParts = new URL(previewUrl);
    const options = {
      hostname: urlParts.hostname,
      port: urlParts.port || 443,
      path: urlParts.pathname + urlParts.search,
      method: 'GET',
      headers: {
        'User-Agent': 'CRM-SoundDownloader/1.0'
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve({
            id: sound.id,
            name: sound.name,
            filename: filename,
            category: category,
            duration: sound.duration,
            license: sound.license,
            username: sound.username
          });
        });
      } else {
        console.log(`❌ Download failed (${res.statusCode}): ${filename}`);
        resolve(null);
      }
    });

    req.on('error', (error) => {
      console.log(`❌ Download error: ${error.message}`);
      resolve(null);
    });

    req.end();
  });
}

// Update theme manifest with new sounds
function updateManifest(themeName, sounds) {
  const manifestPath = path.join(__dirname, '..', 'public', 'sounds', 'themes', themeName, 'manifest.json');
  
  try {
    let manifest = {};
    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }

    if (!manifest.sounds) manifest.sounds = {};

    // Group sounds by category
    for (const sound of sounds) {
      if (!manifest.sounds[sound.category]) {
        manifest.sounds[sound.category] = [];
      }
      
      manifest.sounds[sound.category].push({
        file: sound.filename,
        name: sound.name,
        duration: sound.duration,
        license: sound.license,
        attribution: `${sound.name} by ${sound.username} (Freesound.org)`
      });
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Updated manifest: ${manifestPath}`);
  } catch (error) {
    console.log(`❌ Failed to update manifest: ${error.message}`);
  }
}

// Main execution
async function main() {
  try {
    for (const [themeName, categories] of Object.entries(THEME_QUERIES)) {
      console.log(`\n🎨 Processing theme: ${themeName}`);
      const themePath = path.join(__dirname, '..', 'public', 'sounds', 'themes', themeName);
      
      // Ensure theme directory exists
      if (!fs.existsSync(themePath)) {
        fs.mkdirSync(themePath, { recursive: true });
      }
      
      const allDownloaded = [];
      
      for (const [category, queries] of Object.entries(categories)) {
        console.log(`\n📂 Category: ${category}`);
        
        for (const query of queries) {
          try {
            const sounds = await searchSounds(query);
            
            // Download first 2 sounds from each search
            const soundsToDownload = sounds.slice(0, 2);
            
            for (const sound of soundsToDownload) {
              const result = await downloadPreview(sound, themePath, category);
              if (result) {
                allDownloaded.push(result);
                
                // Add delay to be respectful
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
            
            // Delay between searches
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.log(`❌ Error with query "${query}": ${error.message}`);
          }
        }
      }
      
      // Update manifest for this theme
      if (allDownloaded.length > 0) {
        updateManifest(themeName, allDownloaded);
        console.log(`✅ Theme ${themeName} completed: ${allDownloaded.length} sounds downloaded`);
      }
      
      // Delay between themes
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n🎉 Mass download completed!');
    console.log('🔧 Run updateSoundMappings.js to integrate new sounds into the system');
    
  } catch (error) {
    console.log(`❌ Download process failed: ${error}`);
    process.exit(1);
  }
}

main();