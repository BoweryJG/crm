#!/bin/bash

echo "🎵 Organizing existing sound files for CRM..."

# Create directories if they don't exist
mkdir -p public/sounds/core
mkdir -p public/sounds/themes/boeing-747
mkdir -p public/sounds/themes/f16-viper

# Core UI Sounds - Using existing files
echo -e "\n📥 Setting up Core UI Sounds..."

# UI Clicks
cp "public/sounds/288965__littlerobotsoundfactory__click_electronic_13.wav" "public/sounds/core/ui-click-primary.wav"
cp "public/sounds/750435__rescopicsound__ui-click-menu-modern-interface-select-small-01.mp3" "public/sounds/core/ui-click-secondary.mp3"
cp "public/sounds/475435__o_ciz__click_1metal.wav" "public/sounds/core/ui-click-metal.wav"

# UI Hover
cp "public/sounds/367997__jofae__sci-fi-interface.mp3" "public/sounds/core/ui-hover.mp3"

# UI Toggle
cp "public/sounds/278204__ianstargem__switch-flip-2.wav" "public/sounds/core/ui-toggle.wav"

# Notifications
cp "public/sounds/657950__lilmati__scifi-inspect-sound-ui-or-in-game-notification-02.wav" "public/sounds/core/notification-success.wav"
cp "public/sounds/702805__lilmati__futuristic-inspect-sound-ui-or-in-game-notification.wav" "public/sounds/core/notification-error.wav"

# Navigation
cp "public/sounds/750436__rescopicsound__ui-click-menu-modern-interface-select-small-02.mp3" "public/sounds/core/navigation-forward.mp3"
cp "public/sounds/750433__rescopicsound__ui-click-menu-modern-interface-select-large.mp3" "public/sounds/core/navigation-back.mp3"

# Additional sounds
cp "public/sounds/628638__el_boss__menu-select-tick.wav" "public/sounds/core/gauge-tick.wav"
cp "public/sounds/703884__lilmati__diamond-click.wav" "public/sounds/core/diamond-click.wav"

# CRM-specific sounds
echo -e "\n📞 Setting up CRM-specific sounds..."
cp "public/sounds/81175__mkoenig__metal-click-sound.wav" "public/sounds/core/save-success.wav"
cp "public/sounds/528561__jummit__soft-ui-button-click.ogg" "public/sounds/core/message-sent.ogg"
cp "public/sounds/130138__ecfike__metal-door-slam-shut.wav" "public/sounds/core/door-close.wav"

# Boeing 747 Theme Sounds
echo -e "\n✈️ Setting up Boeing 747 Theme Sounds..."
cp "public/sounds/581370__audiotorp__hydraulic_door_scifi_slowerwithclickandslam.wav" "public/sounds/themes/boeing-747/boeing-button-press.wav"
cp "public/sounds/367997__jofae__sci-fi-interface.mp3" "public/sounds/themes/boeing-747/boeing-autopilot-engage.mp3"
cp "public/sounds/657950__lilmati__scifi-inspect-sound-ui-or-in-game-notification-02.wav" "public/sounds/themes/boeing-747/boeing-altitude-alert.wav"

# F-16 Viper Theme Sounds
echo -e "\n🚀 Setting up F-16 Viper Theme Sounds..."
cp "public/sounds/575419__avreference__radar.wav" "public/sounds/themes/f16-viper/f16-radar-ping.wav"
cp "public/sounds/807657__snoops_audio1__04-alarms-beeps-scanning-for-hostiles-b.wav" "public/sounds/themes/f16-viper/f16-missile-lock.wav"
cp "public/sounds/702805__lilmati__futuristic-inspect-sound-ui-or-in-game-notification.wav" "public/sounds/themes/f16-viper/f16-system-ready.wav"

# Use test-click as fallback
cp "public/sounds/test-click.mp3" "public/sounds/core/fallback-click.mp3"

# Clean up invalid files (243 byte XML errors)
echo -e "\n🧹 Cleaning up invalid files..."
find public/sounds -name "*.mp3" -size -300c -delete
find public/sounds -name "*.wav" -size -300c -delete

# Check results
echo -e "\n📊 Organized sound files:"
echo -e "\nCore sounds:"
ls -lah public/sounds/core/ | grep -E '\.(mp3|wav|ogg)$'

echo -e "\nBoeing 747 theme:"
ls -lah public/sounds/themes/boeing-747/ | grep -E '\.(mp3|wav|ogg)$'

echo -e "\nF-16 Viper theme:"
ls -lah public/sounds/themes/f16-viper/ | grep -E '\.(mp3|wav|ogg)$'

echo -e "\n✅ Sound organization complete!"