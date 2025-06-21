// Create simple test sounds using Web Audio API
const fs = require('fs');
const path = require('path');

// Generate a simple WAV file
function generateWAV(frequency, duration, filename) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  
  // WAV file header
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  
  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk size
  buffer.writeUInt16LE(1, 20); // Audio format (PCM)
  buffer.writeUInt16LE(1, 22); // Number of channels
  buffer.writeUInt32LE(sampleRate, 24); // Sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  
  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Generate audio data
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample;
    
    if (filename.includes('click')) {
      // Click sound - short burst of noise
      sample = i < 100 ? (Math.random() * 2 - 1) * 0.5 : 0;
    } else if (filename.includes('hover')) {
      // Hover sound - soft tone
      const envelope = Math.sin(Math.PI * t / duration);
      sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    } else if (filename.includes('success')) {
      // Success sound - ascending tone
      const freq = frequency * (1 + t);
      const envelope = Math.sin(Math.PI * t / duration);
      sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.4;
    } else if (filename.includes('error')) {
      // Error sound - descending tone
      const freq = frequency * (1.5 - t);
      const envelope = Math.sin(Math.PI * t / duration);
      sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.4;
    } else {
      // Default tone
      sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    }
    
    // Convert to 16-bit PCM
    const pcm = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(pcm, 44 + i * 2);
  }
  
  fs.writeFileSync(filename, buffer);
  console.log(`Created: ${filename}`);
}

// Generate test sounds
const sounds = [
  { name: 'ui-click-primary.wav', freq: 1000, duration: 0.05 },
  { name: 'ui-click-secondary.wav', freq: 800, duration: 0.05 },
  { name: 'ui-hover.wav', freq: 600, duration: 0.1 },
  { name: 'ui-toggle.wav', freq: 500, duration: 0.1 },
  { name: 'notification-success.wav', freq: 400, duration: 0.3 },
  { name: 'notification-error.wav', freq: 600, duration: 0.3 },
  { name: 'navigation-forward.wav', freq: 700, duration: 0.2 },
  { name: 'navigation-back.wav', freq: 500, duration: 0.2 },
];

// Clean up bad MP3 files
const coreDir = 'public/sounds/core';
const files = fs.readdirSync(coreDir);
files.forEach(file => {
  if (file.endsWith('.mp3')) {
    const filePath = path.join(coreDir, file);
    const stats = fs.statSync(filePath);
    if (stats.size < 1000) { // Less than 1KB - probably not a real MP3
      console.log(`Deleting small MP3 file: ${file} (${stats.size} bytes)`);
      fs.unlinkSync(filePath);
    }
  }
});

// Generate WAV files
sounds.forEach(({ name, freq, duration }) => {
  const filepath = path.join(coreDir, name);
  generateWAV(freq, duration, filepath);
});

console.log('Test sounds created!');