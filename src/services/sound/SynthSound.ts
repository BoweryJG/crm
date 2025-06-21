// Synthetic Sound Generator - Create sounds programmatically when files aren't available
export class SynthSound {
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  // Generate a simple click sound
  generateClick(): AudioBuffer {
    const duration = 0.05; // 50ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < channel.length; i++) {
      // Create a short burst of white noise with envelope
      const envelope = Math.exp(-i / channel.length * 10);
      channel[i] = (Math.random() * 2 - 1) * envelope * 0.5;
    }

    return buffer;
  }

  // Generate a hover sound (soft tone)
  generateHover(): AudioBuffer {
    const duration = 0.1; // 100ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);
    const frequency = 800; // Hz

    for (let i = 0; i < channel.length; i++) {
      const envelope = Math.sin(Math.PI * i / channel.length);
      channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * envelope * 0.2;
    }

    return buffer;
  }

  // Generate a success sound (ascending tone)
  generateSuccess(): AudioBuffer {
    const duration = 0.3; // 300ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < channel.length; i++) {
      const progress = i / channel.length;
      const frequency = 400 + progress * 400; // 400Hz to 800Hz
      const envelope = Math.sin(Math.PI * progress) * 0.5;
      channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * envelope;
    }

    return buffer;
  }

  // Generate an error sound (descending tone)
  generateError(): AudioBuffer {
    const duration = 0.3; // 300ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < channel.length; i++) {
      const progress = i / channel.length;
      const frequency = 600 - progress * 200; // 600Hz to 400Hz
      const envelope = Math.sin(Math.PI * progress) * 0.5;
      channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * envelope;
    }

    return buffer;
  }

  // Generate a navigation sound (swoosh)
  generateNavigation(): AudioBuffer {
    const duration = 0.2; // 200ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < channel.length; i++) {
      const progress = i / channel.length;
      // Filtered noise with rising pitch
      const noise = (Math.random() * 2 - 1) * 0.3;
      const filter = Math.sin(Math.PI * progress * 3);
      const envelope = Math.sin(Math.PI * progress);
      channel[i] = noise * filter * envelope;
    }

    return buffer;
  }

  // Generate a gauge tick sound
  generateGaugeTick(): AudioBuffer {
    const duration = 0.02; // 20ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);
    const frequency = 2000; // High frequency tick

    for (let i = 0; i < channel.length; i++) {
      const envelope = Math.exp(-i / channel.length * 20);
      channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * envelope * 0.3;
    }

    return buffer;
  }

  // Map sound IDs to generators
  generateSound(soundId: string): AudioBuffer | null {
    switch (soundId) {
      case 'ui-click-primary':
      case 'ui-click-secondary':
        return this.generateClick();
      
      case 'ui-hover':
        return this.generateHover();
      
      case 'notification-success':
      case 'ui-success':
        return this.generateSuccess();
      
      case 'notification-error':
      case 'ui-error':
        return this.generateError();
      
      case 'navigation-forward':
      case 'navigation-back':
        return this.generateNavigation();
      
      case 'gauge-tick':
      case 'gauge-zone-change':
        return this.generateGaugeTick();
      
      default:
        // Default click for unknown sounds
        return this.generateClick();
    }
  }
}