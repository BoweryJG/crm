const https = require('https');
const fs = require('fs');
const path = require('path');

// Your Freesound API key
const API_KEY = 'VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';

// Create luxury sound directories
const dirs = [
  'public/sounds/luxury',
  'public/sounds/luxury/ambient',
  'public/sounds/luxury/ui',
  'public/sounds/luxury/feedback',
  'public/sounds/luxury/cinematic',
  'public/sounds/luxury/natural'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Luxury sound searches
const luxurySounds = [
  // Ambient & Atmospheric
  { query: 'orchestral swell cinematic', filename: 'orchestral-swell', category: 'ambient' },
  { query: 'soft piano note single', filename: 'piano-note', category: 'ambient' },
  { query: 'string quartet stinger', filename: 'string-stinger', category: 'ambient' },
  { query: 'cinematic whoosh transition', filename: 'cinematic-whoosh', category: 'ambient' },
  { query: 'deep bass pulse cinematic', filename: 'bass-pulse', category: 'ambient' },
  
  // Premium UI
  { query: 'crystal glass ting', filename: 'crystal-ting', category: 'ui' },
  { query: 'silk fabric swoosh', filename: 'silk-swoosh', category: 'ui' },
  { query: 'luxury car door click', filename: 'luxury-click', category: 'ui' },
  { query: 'watch mechanism tick', filename: 'watch-tick', category: 'ui' },
  { query: 'champagne cork pop', filename: 'champagne-pop', category: 'ui' },
  
  // Sophisticated Feedback
  { query: 'harp glissando up', filename: 'harp-success', category: 'feedback' },
  { query: 'brass section fanfare short', filename: 'brass-announce', category: 'feedback' },
  { query: 'violin pizzicato', filename: 'violin-pizz', category: 'feedback' },
  { query: 'concert hall reverb', filename: 'hall-reverb', category: 'feedback' },
  { query: 'grand piano chord', filename: 'piano-chord', category: 'feedback' },
  
  // Luxury Brand Inspired
  { query: 'mechanical watch winding', filename: 'watch-winding', category: 'ui' },
  { query: 'leather creak', filename: 'leather-creak', category: 'ui' },
  { query: 'champagne glass clink', filename: 'glass-clink', category: 'ui' },
  { query: 'heavy door close thud', filename: 'door-thud', category: 'ui' },
  { query: 'pen click premium', filename: 'pen-click', category: 'ui' },
  
  // Cinematic Elements
  { query: 'cinematic impact boom', filename: 'cinematic-impact', category: 'cinematic' },
  { query: 'film projector click', filename: 'film-click', category: 'cinematic' },
  { query: 'deep resonance', filename: 'deep-resonance', category: 'cinematic' },
  { query: 'orchestra hit', filename: 'orchestra-hit', category: 'cinematic' },
  { query: 'tension builder', filename: 'tension-build', category: 'cinematic' },
  
  // Natural Luxury
  { query: 'water drop echo', filename: 'water-drop', category: 'natural' },
  { query: 'wind chimes gentle', filename: 'wind-chimes', category: 'natural' },
  { query: 'fireplace crackle', filename: 'fireplace', category: 'natural' },
  { query: 'ocean waves calm', filename: 'ocean-waves', category: 'natural' },
  { query: 'church bell single', filename: 'church-bell', category: 'natural' }
];

// Search and download function
async function searchAndDownload(item) {
  return new Promise((resolve) => {
    const searchUrl = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(item.query)}&token=${API_KEY}&fields=id,name,previews,duration,username&page_size=3&filter=duration:[0.5 TO 10]`;
    
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            // Try each result until we get a good download
            for (const sound of result.results) {
              console.log(`Found: ${sound.name} by ${sound.username} (${sound.duration.toFixed(1)}s)`);
              
              if (sound.previews && sound.previews['preview-hq-mp3']) {
                const dest = path.join('public/sounds/luxury', item.category, `${item.filename}.mp3`);
                
                try {
                  await downloadFile(sound.previews['preview-hq-mp3'], dest);
                  const stats = fs.statSync(dest);
                  console.log(`✅ Downloaded: ${item.filename}.mp3 (${(stats.size / 1024).toFixed(1)}KB)`);
                  resolve(true);
                  return;
                } catch (e) {
                  // Try next result
                }
              }
            }
            console.log(`❌ No valid downloads for: ${item.query}`);
            resolve(false);
          } else {
            console.log(`❌ No results for: ${item.query}`);
            resolve(false);
          }
        } catch (e) {
          console.log(`❌ Error: ${e.message}`);
          resolve(false);
        }
      });
    });
  });
}

// Download file helper
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        if (stats.size > 5000) { // At least 5KB
          resolve();
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

// Main download process
async function downloadLuxurySounds() {
  console.log('🎼 DOWNLOADING LUXURY CINEMATIC SOUNDS\n');
  console.log('Categories: Ambient, UI, Feedback, Cinematic, Natural\n');
  
  let successCount = 0;
  
  for (const item of luxurySounds) {
    console.log(`\n🔍 Searching: ${item.query}`);
    const success = await searchAndDownload(item);
    if (success) successCount++;
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✨ Download complete!`);
  console.log(`✅ Successfully downloaded: ${successCount}/${luxurySounds.length} sounds`);
  
  // Show what we downloaded
  console.log('\n📁 Downloaded luxury sounds:');
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));
      if (files.length > 0) {
        console.log(`\n${dir}:`);
        files.forEach(f => {
          const stats = fs.statSync(path.join(dir, f));
          console.log(`  - ${f} (${(stats.size / 1024).toFixed(1)}KB)`);
        });
      }
    }
  });
  
  // Copy some to themes
  console.log('\n🎨 Setting up luxury theme...');
  const luxuryThemeDir = 'public/sounds/themes/luxury-premium';
  if (!fs.existsSync(luxuryThemeDir)) {
    fs.mkdirSync(luxuryThemeDir, { recursive: true });
  }
  
  // Copy best sounds to luxury theme
  const copyMap = [
    ['public/sounds/luxury/ui/crystal-ting.mp3', `${luxuryThemeDir}/luxury-notification.mp3`],
    ['public/sounds/luxury/ui/luxury-click.mp3', `${luxuryThemeDir}/luxury-click.mp3`],
    ['public/sounds/luxury/feedback/harp-success.mp3', `${luxuryThemeDir}/luxury-success.mp3`],
    ['public/sounds/luxury/ambient/piano-note.mp3', `${luxuryThemeDir}/luxury-hover.mp3`],
    ['public/sounds/luxury/ui/watch-tick.mp3', `${luxuryThemeDir}/luxury-toggle.mp3`]
  ];
  
  copyMap.forEach(([src, dest]) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied to luxury theme: ${path.basename(dest)}`);
    }
  });
  
  console.log('\n🏆 Your luxury sound collection is ready!');
}

// Run it
downloadLuxurySounds().catch(console.error);