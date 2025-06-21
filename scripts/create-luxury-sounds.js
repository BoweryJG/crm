// Create luxurious, high-end sounds using Web Audio API
const fs = require('fs');
const path = require('path');

// Generate a luxurious WAV file with sophisticated audio design
function generateLuxuryWAV(type, filename) {
  const sampleRate = 44100;
  const duration = type.duration || 0.1;
  const numSamples = Math.floor(sampleRate * duration);
  
  // WAV file header
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  
  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  
  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Generate audio data based on type
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    switch(type.name) {
      case 'luxury-click':
        // Rich, tactile click with harmonics
        const clickEnv = Math.exp(-t * 50);
        sample = Math.sin(2 * Math.PI * 1200 * t) * clickEnv * 0.3 +
                 Math.sin(2 * Math.PI * 2400 * t) * clickEnv * 0.15 +
                 Math.sin(2 * Math.PI * 600 * t) * clickEnv * 0.2;
        if (i < 50) sample += (Math.random() * 2 - 1) * 0.1 * clickEnv;
        break;
        
      case 'crystal-hover':
        // Crystal bell-like hover sound
        const hoverEnv = Math.sin(Math.PI * t / duration);
        sample = Math.sin(2 * Math.PI * 2000 * t) * hoverEnv * 0.15 +
                 Math.sin(2 * Math.PI * 3000 * t) * hoverEnv * 0.1 +
                 Math.sin(2 * Math.PI * 4000 * t) * hoverEnv * 0.05;
        break;
        
      case 'silk-toggle':
        // Smooth, silk-like toggle
        const toggleEnv = Math.sin(Math.PI * t / duration) * Math.exp(-t * 3);
        const freq = 800 + (t * 400);
        sample = Math.sin(2 * Math.PI * freq * t) * toggleEnv * 0.4;
        break;
        
      case 'champagne-success':
        // Effervescent success sound
        const successEnv = Math.sin(Math.PI * t / duration);
        const successFreq = 800 * (1 + t * 1.5);
        sample = Math.sin(2 * Math.PI * successFreq * t) * successEnv * 0.3;
        // Add sparkle
        if (Math.random() > 0.95) {
          sample += Math.sin(2 * Math.PI * (3000 + Math.random() * 2000) * t) * 0.1;
        }
        break;
        
      case 'velvet-error':
        // Soft, non-jarring error
        const errorEnv = Math.sin(Math.PI * t / duration);
        const errorFreq = 400 * (1 - t * 0.3);
        sample = Math.sin(2 * Math.PI * errorFreq * t) * errorEnv * 0.25 +
                 Math.sin(2 * Math.PI * errorFreq * 0.5 * t) * errorEnv * 0.15;
        break;
        
      case 'glide-navigation':
        // Smooth gliding navigation
        const navEnv = Math.sin(Math.PI * t / duration) * Math.exp(-t * 2);
        const navFreq = 600 + Math.sin(t * 10) * 200;
        sample = Math.sin(2 * Math.PI * navFreq * t) * navEnv * 0.3;
        // Add subtle swoosh
        sample += (Math.random() * 2 - 1) * navEnv * 0.05 * Math.sin(t * 20);
        break;
        
      case 'diamond-tick':
        // Precise, crystalline tick
        const tickEnv = Math.exp(-t * 100);
        sample = Math.sin(2 * Math.PI * 3000 * t) * tickEnv * 0.2 +
                 Math.sin(2 * Math.PI * 6000 * t) * tickEnv * 0.1;
        break;
        
      case 'gold-notification':
        // Rich notification chime
        const noteEnv = Math.sin(Math.PI * t / duration) * Math.exp(-t * 1);
        sample = Math.sin(2 * Math.PI * 1000 * t) * noteEnv * 0.2 +
                 Math.sin(2 * Math.PI * 1500 * t) * noteEnv * 0.15 +
                 Math.sin(2 * Math.PI * 2000 * t) * noteEnv * 0.1;
        break;
    }
    
    // Soft clipping for warmth
    sample = Math.tanh(sample * 1.5) * 0.8;
    
    // Convert to 16-bit PCM
    const pcm = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(pcm, 44 + i * 2);
  }
  
  fs.writeFileSync(filename, buffer);
  console.log(`Created luxury sound: ${filename}`);
}

// Sound definitions
const luxurySounds = [
  { name: 'luxury-click', file: 'ui-click-primary.wav', duration: 0.06 },
  { name: 'crystal-hover', file: 'ui-hover.wav', duration: 0.12 },
  { name: 'silk-toggle', file: 'ui-toggle.wav', duration: 0.15 },
  { name: 'champagne-success', file: 'notification-success.wav', duration: 0.4 },
  { name: 'velvet-error', file: 'notification-error.wav', duration: 0.35 },
  { name: 'glide-navigation', file: 'navigation-forward.wav', duration: 0.25 },
  { name: 'glide-navigation', file: 'navigation-back.wav', duration: 0.25 },
  { name: 'diamond-tick', file: 'gauge-tick.wav', duration: 0.03 },
  { name: 'gold-notification', file: 'ui-click-secondary.wav', duration: 0.2 },
];

// Create luxury sounds
const coreDir = 'public/sounds/core';

// Remove old sounds
const oldFiles = fs.readdirSync(coreDir).filter(f => f.endsWith('.wav'));
oldFiles.forEach(file => {
  fs.unlinkSync(path.join(coreDir, file));
  console.log(`Removed old sound: ${file}`);
});

// Generate new luxury sounds
luxurySounds.forEach(sound => {
  const filepath = path.join(coreDir, sound.file);
  generateLuxuryWAV(sound, filepath);
});

console.log('\nLuxury sound suite created! 🥂✨');