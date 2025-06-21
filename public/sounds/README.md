# Omnisensory Experience Engine™ Sound System

## Overview
The CRM features a professional-grade, aviation-inspired sound system that provides immersive audio feedback for all user interactions.

## Sound Themes

### Aviation Themes

#### Boeing 747 Cockpit
- Authentic commercial aviation sounds
- Professional flight deck experience
- Includes master caution, autopilot, FMS, and warning systems

#### F-16 Viper Fighter Jet
- Military fighter jet sounds
- Tactical combat systems
- Features master arm, pickle button, RWR warnings, and missile alerts

### Luxury Themes

#### Hermès Luxury Experience
- Sophisticated boutique door chimes
- Jewelry box and velvet fabric sounds
- Crystal glass and champagne sparkle effects
- Premium leather and silk textures

#### Rolex Watchmaking Excellence
- Precision mechanical watch movements
- Crown winding and bezel clicks
- Swiss lever escapement ticks
- Chronometer certification sounds

### Technology Themes

#### Space Station Interface
- Futuristic sci-fi computer sounds
- Holographic interface activation
- Airlock and warp drive effects
- System alerts and transmission beeps

#### Corporate Professional
- Executive briefcase and pen clicks
- Office ambience and clock ticks
- Professional email notifications
- Approval stamps and success chimes

### Specialized Themes

#### Surgical Suite Professional
- Medical monitor beeps and alarms
- Surgical instrument clicks
- Heart rate and vital signs monitoring
- Clean hospital ambience

#### Formula 1 Racing Team
- F1 engine ignition and warm-up
- Paddle shifts and gear changes
- Team radio communications
- Pit lane ambience and DRS activation

### Core UI Sounds
- Universal interface sounds used across all themes
- Professional mechanical switches and feedback tones
- Optimized for clarity and minimal fatigue

## Directory Structure
```
/sounds/
├── core/                      # Universal UI sounds
│   ├── manifest.json
│   └── *.opus                # Sound files
├── themes/
│   ├── boeing-747/           # Boeing 747 theme
│   │   ├── manifest.json
│   │   └── *.opus
│   ├── f16-viper/            # F-16 Viper theme
│   │   ├── manifest.json
│   │   └── *.opus
│   ├── luxury-hermes/        # Hermès luxury theme
│   │   ├── manifest.json
│   │   └── *.opus
│   ├── rolex-watchmaking/    # Rolex precision theme
│   │   ├── manifest.json
│   │   └── *.opus
│   ├── space-scifi/          # Space station theme
│   │   ├── manifest.json
│   │   └── *.opus
│   ├── medical-surgical/     # Medical suite theme
│   │   ├── manifest.json
│   │   └── *.opus
│   ├── corporate-professional/ # Corporate theme
│   │   ├── manifest.json
│   │   └── *.opus
│   └── formula1-racing/      # F1 racing theme
│       ├── manifest.json
│       └── *.opus
└── README.md
```

## Sound Categories
- **UI Primary**: Main button clicks, important actions
- **UI Secondary**: Secondary interactions, hover states
- **Navigation**: Page transitions, route changes
- **Notifications**: Success, error, and info alerts
- **Gauge**: Gauge movements, zone changes, peaks
- **Ambient**: Background atmosphere (theme-specific)
- **Startup**: Theme initialization sequence

## Performance Modes
1. **Cinema Mode**: Full immersion, highest quality, all sounds enabled
2. **Office Mode**: Balanced for productivity, reduced volume
3. **ASMR Mode**: Enhanced tactile feedback, crisp sounds
4. **Silent Mode**: No sounds (battery saver)

## Implementation
The sound system uses:
- Web Audio API for low-latency playback
- Smart caching for instant response
- Progressive loading for theme sounds
- Haptic feedback on mobile devices

## Settings
Users can customize:
- Master volume
- Category-specific volumes
- Performance mode
- Enable/disable sounds
- Test individual sounds

Access sound settings in: Settings → Sound

## Adding New Sounds
1. Add sound file to appropriate directory
2. Update manifest.json with sound configuration
3. Use appropriate hook in component:
   - `useButtonSound()` for buttons
   - `useNavigationSound()` for routing
   - `useGaugeSound()` for gauges
   - `useNotificationSound()` for alerts
   - `useThemeSound()` for theme switching

## Sound File Requirements
- Format: Opus (preferred) or MP3 (fallback)
- Duration: < 500ms for UI sounds
- Volume: Normalized to -12dB
- Sample Rate: 48kHz
- Bit Rate: 128kbps (Opus) or 192kbps (MP3)

## Credits
Sound system designed and implemented by the Omnisensory Experience Engine™ team.
Professional aviation sounds sourced from:
- Freesound.org (Creative Commons)
- BBC Sound Effects Archive
- Professional flight simulators
- Aviation enthusiast communities