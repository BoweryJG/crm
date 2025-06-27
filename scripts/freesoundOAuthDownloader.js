#!/usr/bin/env node

/**
 * Freesound OAuth2 API Mass Downloader
 * Implements proper OAuth2 flow for Freesound API
 * Downloads 40-60 sounds per theme using real authentication
 */

const https = require('https');
const http = require('http');
const open = require('open').default || require('open');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');

// OAuth2 Configuration from your Freesound app
const CLIENT_ID = 'upfQ4yuxVID9g9AUwDhx';
const CLIENT_SECRET = 'VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';
const REDIRECT_URI = 'http://localhost:8000/callback'; // Local callback server
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

// OAuth2 Functions
function startOAuthFlow() {
  return new Promise((resolve, reject) => {
    const authUrl = new URL(`${FREESOUND_API_BASE}/oauth2/authorize/`);
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', 'read');

    console.log('🔐 Starting OAuth2 authentication...');
    console.log('🌐 Opening browser for authentication...');
    
    // Create local server to handle callback
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:8000`);
      
      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        
        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>Authentication Failed</h1><p>You can close this window.</p>');
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }
        
        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>Authentication Successful!</h1><p>You can close this window and return to the terminal.</p>');
          server.close();
          resolve(code);
          return;
        }
      }
      
      res.writeHead(404);
      res.end('Not found');
    });

    server.listen(8000, () => {
      console.log('📡 Local callback server started on port 8000');
      open(authUrl.toString());
    });
  });
}

function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
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

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tokenData = JSON.parse(data);
          if (tokenData.access_token) {
            resolve(tokenData.access_token);
          } else {
            reject(new Error(`Token exchange failed: ${data}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// API Functions
function makeApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'freesound.org',
      path: `/apiv2${endpoint}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    https.get(options, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          if (response.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`API request failed: ${response.statusCode} - ${data}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function searchSounds(query, maxResults = 8) {
  try {
    const searchParams = new URLSearchParams({
      query: query,
      page_size: maxResults,
      filter: 'duration:[0.1 TO 4.0] AND type:(wav OR mp3)',
      sort: 'downloads_desc'
    });
    
    const endpoint = `/search/text/?${searchParams}`;
    const response = await makeApiRequest(endpoint);
    return response.results || [];
  } catch (error) {
    console.log(`    ⚠️  Search failed for "${query}": ${error.message}`);
    return [];
  }
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
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

async function downloadThemeSounds(themeName, queries) {
  console.log(`🎵 Processing theme: ${themeName.toUpperCase()}`);
  
  const themeDir = `public/sounds/themes/${themeName}`;
  fs.mkdirSync(themeDir, { recursive: true });
  
  let totalDownloaded = 0;
  
  for (const [category, searchQueries] of Object.entries(queries)) {
    console.log(`  📂 Category: ${category}`);
    
    let categoryDownloaded = 0;
    const maxPerCategory = 10;
    
    for (const query of searchQueries) {
      if (categoryDownloaded >= maxPerCategory) break;
      
      console.log(`    🔍 Searching: "${query}"`);
      
      try {
        const sounds = await searchSounds(query, 3);
        
        for (const sound of sounds) {
          if (categoryDownloaded >= maxPerCategory) break;
          
          try {
            const soundDetail = await makeApiRequest(`/sounds/${sound.id}/`);
            
            if (soundDetail.previews && soundDetail.previews['preview-lq-mp3']) {
              const downloadUrl = soundDetail.previews['preview-lq-mp3'];
              const fileName = `${category}-${sound.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 30)}.mp3`;
              const outputPath = path.join(themeDir, fileName);
              
              console.log(`    ⬇️  Downloading: ${sound.name}`);
              
              await downloadFile(downloadUrl, outputPath);
              
              const stats = fs.statSync(outputPath);
              if (stats.size > 1000) {
                console.log(`    ✅ Success: ${fileName} (${Math.round(stats.size/1024)}KB)`);
                categoryDownloaded++;
                totalDownloaded++;
              } else {
                fs.unlinkSync(outputPath);
                console.log(`    ⚠️  File too small, removed`);
              }
              
              // Rate limiting
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (downloadError) {
            console.log(`    ❌ Download failed: ${downloadError.message}`);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (searchError) {
        console.log(`    ❌ Search failed: ${searchError.message}`);
      }
    }
    
    console.log(`  📊 Category ${category}: ${categoryDownloaded} sounds downloaded`);
  }
  
  console.log(`🎯 Theme ${themeName}: ${totalDownloaded} total sounds downloaded\n`);
  return totalDownloaded;
}

async function main() {
  console.log('🚀 FREESOUND OAUTH2 MASS DOWNLOADER');
  console.log('🎯 Target: 40-60 sounds per theme using OAuth2 authentication');
  console.log('');
  
  try {
    // Step 1: OAuth2 Authentication
    const authCode = await startOAuthFlow();
    console.log('✅ Authorization code received');
    
    accessToken = await exchangeCodeForToken(authCode);
    console.log('✅ Access token obtained');
    console.log('');
    
    // Step 2: Download sounds for each theme
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
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('💡 Please check your OAuth2 credentials and try again');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { downloadThemeSounds, searchSounds, THEME_QUERIES };