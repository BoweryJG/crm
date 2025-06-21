# Omnisensory Experience Engine™ - Implementation Plan

## Current Status
- ✅ Core SoundManager system created
- ✅ Smart caching system implemented  
- ✅ React hooks for easy integration
- ✅ Boeing 747 theme manifest defined
- ⏳ Actual sound files needed

## Sound Files Needed

### Core UI Sounds (All Themes Use These)
1. **ui-click-primary.mp3** - Main button click
2. **ui-click-secondary.mp3** - Secondary button click
3. **ui-hover.mp3** - Hover state
4. **ui-toggle.mp3** - Switch/toggle
5. **ui-error.mp3** - Error notification
6. **ui-success.mp3** - Success notification
7. **navigation-forward.mp3** - Page forward
8. **navigation-back.mp3** - Page back

### Boeing 747 Theme Sounds
1. **master-caution-reset.mp3** - Theme switch sound
2. **autopilot-engage.mp3** - Primary click
3. **radio-ptt.mp3** - Secondary click
4. **altitude-selector-tick.mp3** - Hover sound
5. **landing-gear-lever.mp3** - Toggle sound
6. **fms-waypoint-confirm.mp3** - Navigation forward
7. **fms-cancel.mp3** - Navigation back
8. **altimeter-tick.mp3** - Gauge tick
9. **altitude-alert.mp3** - Gauge zone change
10. **positive-rate.mp3** - Gauge peak/success
11. **seatbelt-chime.mp3** - Success notification
12. **stick-shaker.mp3** - Error notification
13. **selcal-chime.mp3** - Info notification
14. **apu-start.mp3** - Startup sequence 1
15. **avionics-power.mp3** - Startup sequence 2
16. **gyro-spinup.mp3** - Startup sequence 3
17. **cockpit-ready.mp3** - Startup sequence 4

### F-16 Viper Theme Sounds
1. **master-arm-switch.mp3** - Theme switch
2. **pickle-button.mp3** - Primary click (weapon release)
3. **radio-transmit.mp3** - Secondary click
4. **mfd-button.mp3** - Hover sound
5. **gear-handle.mp3** - Toggle sound
6. **hud-select.mp3** - Navigation
7. **rwr-lock.mp3** - Gauge alerts
8. **fox-two.mp3** - Success sound
9. **missile-warning.mp3** - Error sound
10. **jet-engine-start.mp3** - Startup sequence

## Where to Get Sounds

### Free Resources:
1. **Freesound.org** - Creative Commons sounds
2. **Zapsplat.com** - Free with account
3. **NASA Audio Collection** - Real space/aviation sounds
4. **US Military Archives** - Public domain military sounds
5. **YouTube + Audio Extractor** - For specific aircraft sounds

### Search Terms:
- "Boeing 747 cockpit sounds"
- "Aircraft button click"
- "Fighter jet switches"
- "Aviation warning sounds"
- "Cockpit ambience"

## Integration Points

### 1. Theme Toggle
```typescript
// In ThemeToggle.tsx
import { useThemeSound } from '../hooks/useSound';

const { playThemeSwitch } = useThemeSound();
// Call on theme change
```

### 2. Buttons
```typescript
// In any button component
import { useButtonSound } from '../hooks/useSound';

const { handlers } = useButtonSound('primary');
<Button {...handlers}>Click Me</Button>
```

### 3. Gauges
```typescript
// In gauge components
import { useGaugeSound } from '../hooks/useSound';

const { tick, zone, peak } = useGaugeSound();
// Call during needle movement
```

### 4. Navigation
```typescript
// In routing
import { useNavigationSound } from '../hooks/useSound';

const { forward, back } = useNavigationSound();
// Call on route changes
```

## Settings UI Needed

### Sound Settings Component
- Master volume slider
- Category volume controls
- Performance mode selector (Cinema/Office/Silent/ASMR)
- Theme sound preview
- Sound pack selector
- Download progress indicator

## Next Steps

1. **Collect Sound Files**
   - Download from free resources
   - Convert to MP3/Opus format
   - Optimize file sizes
   - Place in correct directories

2. **Create More Theme Packs**
   - F-16 Viper
   - Hermès Leather Atelier  
   - Rolex Manufacture
   - Medical Operating Room
   - Formula 1 Pit

3. **Integrate with Components**
   - Add sound hooks to existing buttons
   - Wire up gauge sounds
   - Add to theme switcher
   - Navigation transitions

4. **Build Settings UI**
   - Create SoundSettings component
   - Add to Settings page
   - Persist preferences

5. **Performance Testing**
   - Test on mobile devices
   - Optimize loading times
   - Implement lazy loading
   - Add offline support

## File Structure
```
/public/sounds/
├── core/                    # Essential sounds (5-10MB)
│   ├── ui-click-primary.mp3
│   ├── ui-hover.mp3
│   └── ...
└── themes/                  # Theme-specific sounds
    ├── boeing-747/
    │   ├── manifest.json
    │   ├── master-caution-reset.mp3
    │   └── ...
    ├── f16-viper/
    │   ├── manifest.json
    │   └── ...
    └── ...
```

## CDN Strategy
- Core sounds: Bundle with app
- Theme sounds: CDN with progressive download
- Cache popular themes locally
- Stream rare/premium sounds

## Notes
- Keep sounds under 500ms duration
- Normalize volume to -12dB
- Use Opus format when possible (smaller files)
- Provide MP3 fallback for compatibility
- Test with screen readers for accessibility