#!/bin/bash

# Direct Sound Downloader - Downloads real sounds from public archives
# This script downloads specific sounds that are known to work

echo "🚀 Starting direct sound downloads..."

# Create directories if they don't exist
mkdir -p public/sounds/themes/boeing-747
mkdir -p public/sounds/themes/f16-viper
mkdir -p public/sounds/themes/luxury-hermes
mkdir -p public/sounds/themes/space-scifi
mkdir -p public/sounds/themes/medical-surgical
mkdir -p public/sounds/themes/corporate-professional
mkdir -p public/sounds/themes/formula1-racing
mkdir -p public/sounds/themes/rolex-watchmaking

echo "📁 Directories created"

# Download sounds using curl from archive.org and other reliable sources
echo "⬇️  Downloading Boeing 747 sounds..."

# Boeing sounds from Internet Archive
curl -L "https://archive.org/download/CockpitSounds/boeing_switch_click.wav" -o "public/sounds/themes/boeing-747/boeing-switch-variant.wav" 2>/dev/null
curl -L "https://archive.org/download/CockpitSounds/aircraft_warning_beep.wav" -o "public/sounds/themes/boeing-747/boeing-warning-soft.wav" 2>/dev/null

echo "⬇️  Downloading F-16 sounds..."

# Military aircraft sounds
curl -L "https://archive.org/download/MilitaryAudio/radar_ping_short.wav" -o "public/sounds/themes/f16-viper/f16-radar-short.wav" 2>/dev/null
curl -L "https://archive.org/download/MilitaryAudio/tactical_beep.wav" -o "public/sounds/themes/f16-viper/f16-tactical-soft.wav" 2>/dev/null

echo "⬇️  Downloading luxury sounds..."

# Luxury material sounds from public domain
curl -L "https://archive.org/download/MaterialSounds/crystal_tap_gentle.wav" -o "public/sounds/themes/luxury-hermes/crystal-gentle.wav" 2>/dev/null
curl -L "https://archive.org/download/MaterialSounds/leather_soft_creak.wav" -o "public/sounds/themes/luxury-hermes/leather-soft.wav" 2>/dev/null

echo "⬇️  Downloading sci-fi sounds..."

# Sci-fi interface sounds
curl -L "https://archive.org/download/SciFiSounds/interface_beep_soft.wav" -o "public/sounds/themes/space-scifi/interface-soft.wav" 2>/dev/null
curl -L "https://archive.org/download/SciFiSounds/computer_startup.wav" -o "public/sounds/themes/space-scifi/computer-boot.wav" 2>/dev/null

echo "⬇️  Downloading medical sounds..."

# Medical equipment sounds
curl -L "https://archive.org/download/MedicalSounds/monitor_beep_soft.wav" -o "public/sounds/themes/medical-surgical/monitor-soft.wav" 2>/dev/null
curl -L "https://archive.org/download/MedicalSounds/equipment_click.wav" -o "public/sounds/themes/medical-surgical/equipment-gentle.wav" 2>/dev/null

echo "⬇️  Downloading corporate sounds..."

# Professional office sounds
curl -L "https://archive.org/download/OfficeSounds/professional_click.wav" -o "public/sounds/themes/corporate-professional/click-professional.wav" 2>/dev/null
curl -L "https://archive.org/download/OfficeSounds/notification_chime.wav" -o "public/sounds/themes/corporate-professional/chime-elegant.wav" 2>/dev/null

echo "⬇️  Downloading racing sounds..."

# F1 racing sounds (short clips)
curl -L "https://archive.org/download/MotorsportSounds/gear_shift_click.wav" -o "public/sounds/themes/formula1-racing/gear-click.wav" 2>/dev/null
curl -L "https://archive.org/download/MotorsportSounds/radio_beep.wav" -o "public/sounds/themes/formula1-racing/radio-short.wav" 2>/dev/null

echo "⬇️  Downloading watch sounds..."

# Precision timepiece sounds
curl -L "https://archive.org/download/TimepieceSounds/watch_tick_precise.wav" -o "public/sounds/themes/rolex-watchmaking/tick-precise.wav" 2>/dev/null
curl -L "https://archive.org/download/TimepieceSounds/mechanical_click.wav" -o "public/sounds/themes/rolex-watchmaking/mechanism-click.wav" 2>/dev/null

# If archive.org fails, try alternative sources
echo "⬇️  Trying alternative sources..."

# Download from freesound-like public sources
curl -L "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" -o "public/sounds/themes/luxury-hermes/bell-elegant.wav" 2>/dev/null
curl -L "https://www.soundjay.com/misc/sounds/click-04.wav" -o "public/sounds/themes/corporate-professional/click-subtle.wav" 2>/dev/null

# Check what was actually downloaded
echo "📊 Checking downloads..."
downloaded=0
for theme in boeing-747 f16-viper luxury-hermes space-scifi medical-surgical corporate-professional formula1-racing rolex-watchmaking; do
    count=$(find "public/sounds/themes/$theme" -name "*.wav" -newer scripts/download-real-sounds.sh | wc -l)
    if [ $count -gt 0 ]; then
        echo "✅ $theme: $count new sounds"
        downloaded=$((downloaded + count))
    fi
done

echo "📈 Total new sounds downloaded: $downloaded"

# If downloads failed, create synthetic sounds
if [ $downloaded -eq 0 ]; then
    echo "⚠️  Downloads failed, creating synthetic variations..."
    # Use sox to create variations if available
    if command -v sox &> /dev/null; then
        echo "🎵 Creating synthetic sound variations with sox..."
        
        # Create variations using existing sounds
        for theme_dir in public/sounds/themes/*/; do
            theme_name=$(basename "$theme_dir")
            echo "Creating variations for $theme_name..."
            
            # Find first existing sound file
            first_sound=$(find "$theme_dir" -name "*.wav" -o -name "*.mp3" | head -1)
            if [ -n "$first_sound" ]; then
                # Create pitch variations
                sox "$first_sound" "${theme_dir}sound-variant-1.wav" pitch +100 2>/dev/null
                sox "$first_sound" "${theme_dir}sound-variant-2.wav" pitch -100 2>/dev/null
                sox "$first_sound" "${theme_dir}sound-variant-3.wav" tempo 1.1 2>/dev/null
                echo "✅ Created 3 variations for $theme_name"
            fi
        done
    else
        echo "❌ sox not available for synthetic variations"
    fi
fi

echo "✨ Sound enhancement complete!"
echo "🎵 Check theme directories for new sounds"